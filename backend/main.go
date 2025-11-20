package main

import (
	"backend/internal/handler"
	"backend/internal/repository/db"
	"backend/internal/service"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	ginmiddleware "github.com/oapi-codegen/gin-middleware"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf(".env 파일을 로드하지 못했습니다: %v", err)
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)
	// 보안상 비밀번호는 마스킹하여 출력
	fmt.Printf("DB URL: postgres://%s:***@%s:%s/%s\n", dbUser, dbHost, dbPort, dbName)

	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}
	defer dbpool.Close()

	queries := db.New(dbpool)
	echomongService := service.NewEchomongService(queries)
	userService := service.NewUserService(queries)
	apiHandler := handler.NewApiHandler(echomongService, userService)
	strictHandler := handler.NewStrictHandler(apiHandler, nil)

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	router.Use(cors.New(config))

	spec, err := handler.GetSwagger()
	if err != nil {
		log.Fatalf("OpenAPI 스펙 로드 실패: %v", err)
	}

	// 1. OpenAPI 검증 미들웨어
	router.Use(ginmiddleware.OapiRequestValidator(spec))

	// ★ [추가됨] 2. 인증 미들웨어 (토큰 해석용)
	router.Use(handler.NewAuthMiddleware())

	// 3. 핸들러 등록
	handler.RegisterHandlers(router, strictHandler)

	log.Println("🚀 서버 실행 중... http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
