package service

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"backend/internal/repository/db"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// .env에서 JWT_SECRET 읽기
func getJwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET 환경 변수가 설정되지 않았습니다.")
	}
	return []byte(secret)
}

type UserService struct {
	queries db.Querier
}

func NewUserService(queries db.Querier) *UserService {
	return &UserService{queries: queries}
}

// 1. 회원가입 로직
func (s *UserService) Register(ctx context.Context, username, password string) (db.User, error) {
	// 비밀번호 해시 생성
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return db.User{}, err
	}

	params := db.CreateUserParams{
		Username:     username,
		PasswordHash: string(hashedPassword),
	}
	return s.queries.CreateUser(ctx, params)
}

// 2. 로그인 로직
func (s *UserService) Login(ctx context.Context, username, password string) (string, error) {
	// DB에서 사용자 조회
	user, err := s.queries.GetUserByUsername(ctx, username)
	if err != nil { // 사용자가 없으면
		return "", errors.New("invalid credentials")
	}

	// 해시된 비밀번호 비교
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil { // 비밀번호가 틀리면
		return "", errors.New("invalid credentials")
	}

	// 3. JWT 토큰 생성
	claims := jwt.MapClaims{
		"sub": user.ID, // Subject (사용자 ID)
		"aud": "echomong_app",
		"exp": time.Now().Add(time.Hour * 24).Unix(), // 만료 시간 (24시간)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJwtSecret())
}
