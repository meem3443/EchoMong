package integration

import (
	"backend/internal/handler"
	"backend/internal/repository/db"
	"backend/internal/service"
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// setupTestServer는 main.go의 main 함수와 거의 동일하게
// 실제 DB 연결과 Gin 라우터를 설정합니다.
func setupTestServer(t *testing.T) (http.Handler, *pgxpool.Pool) {
	// .env 파일 로드 (테스트 실행 위치 기준)
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf(".env 파일을 로드하지 못했습니다: %v", err)
	}

	// DB 연결 문자열 생성
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	// DB 풀 생성
	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}

	// 의존성 주입 (main.go와 동일)
	queries := db.New(dbpool)
	echomongService := service.NewEchomongService(queries)
	userService := service.NewUserService(queries)
	apiHandler := handler.NewApiHandler(echomongService, userService)
	strictHandler := handler.NewStrictHandler(apiHandler, nil)

	// Gin 라우터 설정 (테스트 모드)
	gin.SetMode(gin.TestMode)
	router := gin.New() // Default() 대신 New()를 사용해 깔끔하게 테스트
	handler.RegisterHandlers(router, strictHandler)

	return router, dbpool
}

// TestIntegrationGetEchomong는 /echomong/{id} 엔드포인트에 대한 통합 테스트입니다.
func TestIntegrationGetEchomong(t *testing.T) {
	// --- 1. 테스트 서버 및 DB 연결 설정 ---
	router, dbpool := setupTestServer(t)
	defer dbpool.Close()

	ctx := context.Background()
	testID := 99999 // 충돌을 피하기 위한 임의의 ID
	testTitle := "테스트용 에코몽"

	// --- 2. 테스트 데이터 삽입 ---
	// 테스트를 위해 DB에 임시 데이터를 삽입합니다.
	_, err := dbpool.Exec(ctx,
		"INSERT INTO echomong (id, title, lyrics, img_url) VALUES ($1, $2, 'test lyrics', 'test_url')",
		testID, testTitle)
	if err != nil {
		t.Fatalf("테스트 데이터 삽입 실패: %v", err)
	}

	// ★ 테스트가 끝나면 삽입한 데이터를 반드시 삭제합니다.
	defer dbpool.Exec(ctx, "DELETE FROM echomong WHERE id = $1", testID)

	// --- 3. HTTP 요청 시뮬레이션 ---
	// /echomong/99999 엔드포인트로 GET 요청을 보냅니다.
	w := httptest.NewRecorder() // 가짜 응답(Response) 객체
	req, _ := http.NewRequest("GET", fmt.Sprintf("/echomong/%d", testID), nil)

	router.ServeHTTP(w, req) // Gin 라우터에 요청 전달

	// --- 4. 결과 검증 ---
	// 4.1. 상태 코드가 200 (OK)인지 확인
	if w.Code != http.StatusOK {
		t.Errorf("예상 상태 코드 %d, 실제 %d", http.StatusOK, w.Code)
	}

	// 4.2. 응답 본문에 삽입한 데이터(testTitle)가 포함되어 있는지 확인
	responseBody := w.Body.String()
	if !strings.Contains(responseBody, testTitle) {
		t.Errorf("응답 본문에 '%s'가 포함되어야 합니다. 실제: %s", testTitle, responseBody)
	}

	t.Logf("응답 본문: %s", responseBody)
}
