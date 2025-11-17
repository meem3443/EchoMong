package handler

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// .env에서 JWT_SECRET 읽기
func getJwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET 환경 변수가 설정되지 않았습니다.")
	}
	return []byte(secret)
}

// oapi-codegen의 securityScheme (BearerAuth)를 만족하는 미들웨어 함수
func NewAuthMiddleware() func(c *gin.Context, scopes []string) error {
	return func(c *gin.Context, scopes []string) error {
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			return errors.New("authorization header required")
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return errors.New("invalid authorization header format")
		}

		tokenString := parts[1]

		// 토큰 검증
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return getJwtSecret(), nil
		})

		if err != nil {
			return fmt.Errorf("invalid token: %w", err)
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if userID, ok := claims["sub"].(float64); ok {
				ctx := context.WithValue(c.Request.Context(), "user_id", int64(userID))
				c.Request = c.Request.WithContext(ctx)
				return nil
			}
		}

		return errors.New("invalid token")
	}
}
