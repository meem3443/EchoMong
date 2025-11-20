package integration

import (
	"backend/internal/handler"
	"backend/internal/repository/db"
	"backend/internal/service"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// setupTestServer는 실제 DB 연결과 Gin 라우터를 설정합니다.
func setupTestServer(_ *testing.T) (http.Handler, *pgxpool.Pool) {

	// 상위 폴더의 .env 로드
	err := godotenv.Load("../.env")
	if err != nil {
		log.Printf("테스트: .env 파일 로드 실패 (make test로 실행 시 정상): %v", err)
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}

	queries := db.New(dbpool)
	echomongService := service.NewEchomongService(queries)
	userService := service.NewUserService(queries)
	apiHandler := handler.NewApiHandler(echomongService, userService)
	strictHandler := handler.NewStrictHandler(apiHandler, nil)

	gin.SetMode(gin.TestMode)
	router := gin.New()

	// ★ [추가됨] 테스트 서버에도 인증 미들웨어 장착!
	// (이게 없으면 테스트에서 토큰을 보내도 무시당함)
	router.Use(handler.NewAuthMiddleware())

	handler.RegisterHandlers(router, strictHandler)

	return router, dbpool
}
