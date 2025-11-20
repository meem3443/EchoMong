package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIntegrationJoinTeam(t *testing.T) {
	// 1. 서버 및 DB 설정
	router, dbpool := setupTestServer(t)
	defer dbpool.Close()

	ctx := context.Background()

	// --- 테스트 데이터 준비 ---
	email := "integration_test@example.com"
	password := "password123"
	username := "int_tester"
	teamTitle := "Integration_Test_Team"

	// 데이터 클린업 (테스트 시작 전/후로 찌꺼기 데이터 삭제)
	cleanUp := func() {
		dbpool.Exec(ctx, "DELETE FROM users WHERE email = $1", email)
		dbpool.Exec(ctx, "DELETE FROM echomong WHERE title = $1", teamTitle)
	}
	cleanUp()
	defer cleanUp()

	// ★ [핵심] 시퀀스 동기화 (ID 충돌 방지)
	_, _ = dbpool.Exec(ctx, "SELECT setval('echomong_id_seq', (SELECT COALESCE(MAX(id), 1) FROM echomong))")

	// 2. 팀(Echomong) 데이터 DB에 삽입
	_, err := dbpool.Exec(ctx, "INSERT INTO echomong (title, lyrics, img_url) VALUES ($1, 'lyrics', 'url')", teamTitle)
	assert.NoError(t, err, "팀 데이터 생성 실패")

	// 3. [API] 회원가입 요청
	registerBody := fmt.Sprintf(`{"email":"%s", "username":"%s", "password":"%s"}`, email, username, password)
	reqRegister, _ := http.NewRequest("POST", "/register", strings.NewReader(registerBody))
	reqRegister.Header.Set("Content-Type", "application/json")
	wRegister := httptest.NewRecorder()
	router.ServeHTTP(wRegister, reqRegister)
	assert.Equal(t, http.StatusCreated, wRegister.Code, "회원가입 실패")

	// 4. [API] 로그인 요청 (토큰 얻기)
	loginBody := fmt.Sprintf(`{"email":"%s", "password":"%s"}`, email, password)
	reqLogin, _ := http.NewRequest("POST", "/login", strings.NewReader(loginBody))
	reqLogin.Header.Set("Content-Type", "application/json")
	wLogin := httptest.NewRecorder()
	router.ServeHTTP(wLogin, reqLogin)
	assert.Equal(t, http.StatusOK, wLogin.Code, "로그인 실패")

	// 토큰 파싱
	var loginResp struct {
		Token string `json:"token"`
	}
	err = json.Unmarshal(wLogin.Body.Bytes(), &loginResp)
	assert.NoError(t, err)
	token := loginResp.Token
	assert.NotEmpty(t, token, "토큰이 비어있습니다")

	// 5. [API] 팀 가입 요청
	t.Run("팀_이름으로_가입_성공", func(t *testing.T) {
		joinBody := fmt.Sprintf(`{"title":"%s"}`, teamTitle)
		reqJoin, _ := http.NewRequest("POST", "/user/team", strings.NewReader(joinBody))

		reqJoin.Header.Set("Content-Type", "application/json")
		reqJoin.Header.Set("Authorization", "Bearer "+token)

		wJoin := httptest.NewRecorder()
		router.ServeHTTP(wJoin, reqJoin)

		// 검증
		assert.Equal(t, http.StatusOK, wJoin.Code)
		assert.Contains(t, wJoin.Body.String(), "성공")
	})

	// 6. DB 검증
	// ★ [핵심] NULL 값 안전하게 받기 위해 *int64 사용
	var userTeamID *int64
	err = dbpool.QueryRow(ctx, "SELECT team FROM users WHERE email = $1", email).Scan(&userTeamID)

	assert.NoError(t, err)
	assert.NotNil(t, userTeamID, "유저의 Team ID가 NULL입니다 (업데이트 실패 - 미들웨어 동작 확인 필요)")

	if userTeamID != nil {
		assert.NotZero(t, *userTeamID, "Team ID는 0이 아니어야 합니다")
	}
}
