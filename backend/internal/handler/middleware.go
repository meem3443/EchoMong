package handler

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// getJwtSecret 함수 (기존과 동일)
func getJwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("⚠️ 경고: JWT_SECRET 설정 안됨")
		return []byte("secret_key_for_test")
	}
	return []byte(secret)
}

// NewAuthMiddleware : 인증 미들웨어
func NewAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		requestPath := c.Request.URL.Path

		if requestPath == "/login" || requestPath == "/register" {

			return
		}

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "인증 토큰이 필요합니다."})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "잘못된 헤더 형식입니다."})
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("서명 방식 오류: %v", token.Header["alg"])
			}
			return getJwtSecret(), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 토큰입니다."})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if email, ok := claims["sub"].(string); ok {
				// Gin Context에 저장
				c.Set("email", email)

				// Request Context에도 저장 (Strict Server 호환용)
				ctx := context.WithValue(c.Request.Context(), "email", email)
				c.Request = c.Request.WithContext(ctx)
			}
		}

		c.Next()
	}
}
