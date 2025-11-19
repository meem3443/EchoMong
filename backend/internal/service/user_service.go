// internal/service/user_service.go
package service

import (
	"context"
	"errors"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
		return "", errors.New("invalid credentials")
	}

	// 비밀번호 검증
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// JWT 토큰 생성 (user.ID 대신 user.Email 사용)
	token, err := s.generateJWT(user.Email, user.Username)
	if err != nil {
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
