// internal/service/user_service.go
package service

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"

	"backend/internal/repository/db"
)

type UserService struct {
	queries *db.Queries
}

func NewUserService(queries *db.Queries) *UserService {
	return &UserService{queries: queries}
}

// RegisterUser - 회원가입
func (s *UserService) RegisterUser(ctx context.Context, email, username, password string) (*db.User, error) {
	// 비밀번호 해싱
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// CreateUser 호출 (email, username, password_hash 순서)
	user, err := s.queries.CreateUser(ctx, db.CreateUserParams{
		Email:        email,
		Username:     username,
		PasswordHash: string(hashedPassword),
	})

	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return nil, errors.New("user already exists")
		}

		return nil, err
	}

	return &user, nil
}

// LoginUser - 로그인
func (s *UserService) LoginUser(ctx context.Context, email, password string) (string, error) {
	// 이메일로 사용자 조회
	user, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		// ▼▼▼ 에러 로그 출력 (여기서 무슨 에러인지 확인!) ▼▼▼
		fmt.Printf("❌ DB 조회 에러: %v\n", err)
		return "", errors.New("invalid credentials")
	}

	// 비밀번호 검증
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		// ▼▼▼ 비밀번호 틀림 로그 ▼▼▼
		fmt.Printf("❌ 비밀번호 불일치: %v\n", err)
		return "", errors.New("invalid credentials")
	}

	// JWT 토큰 생성
	token, err := s.generateJWT(user.Email, user.Username)
	if err != nil {
		// ▼▼▼ 토큰 생성 실패 로그 ▼▼▼
		fmt.Printf("❌ JWT 생성 실패: %v\n", err)
		return "", err
	}

	return token, nil
}

// JWT 토큰 생성
func (s *UserService) generateJWT(email, username string) (string, error) {
	claims := jwt.MapClaims{
		"sub":      email, // subject를 email로 변경
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func (s *UserService) JoinTeam(ctx context.Context, email string, teamTitle string) (int64, error) {

	// 1. 팀 이름으로 ID 조회
	teamID, err := s.queries.GetEchomongByTitle(ctx, pgtype.Text{String: teamTitle, Valid: true})
	if err != nil {
		if err.Error() == "no rows in result set" { // 혹은 sql.ErrNoRows 체크
			return 0, &ServiceError{Code: 404, Message: "해당 이름의 팀을 찾을 수 없습니다."} // ★ 0 반환 추가
		}
		return 0, &ServiceError{Code: 500, Message: "서버 에러: " + err.Error()} // ★ 0 반환 추가
	}

	// 2. 유저 정보 업데이트
	arg := db.UpdateUserTeamParams{
		Team:  pgtype.Int8{Int64: teamID, Valid: true},
		Email: email,
	}

	if err := s.queries.UpdateUserTeam(ctx, arg); err != nil {
		return 0, &ServiceError{Code: 500, Message: "팀 가입 실패"} // ★ 0 반환 추가
	}

	// ★ 성공 시 teamID와 nil 반환
	return teamID, nil
}
