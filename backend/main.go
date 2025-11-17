package main

import (
	"backend/internal/handler"       // 6단계 핸들러
	"backend/internal/repository/db" // 3단계 레포지토리
	"backend/internal/service"       // 5단계 서비스
	"context"
	"fmt" // 1. fmt 임포트 (문자열 조합용)
	"log"
	"net/http"
	"os" // 2. os 임포트 (환경 변수 읽기용)

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv" // 3. godotenv 임포트
	ginmiddleware "github.com/oapi-codegen/gin-middleware"
)

func main() {
	// --- 1. .env 파일 로드 ---
	err := godotenv.Load()
	if err != nil {
		log.Fatalf(".env 파일을 로드하지 못했습니다: %v", err)
	}

	// --- 2. 환경 변수를 읽어 DB 연결 문자열 생성 ---
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// postgres://echomong_app:hot1234!@localhost:5432/echomongDB
	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	// --- 3. DB 연결 ---
	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}
	defer dbpool.Close()

	// --- 4. 의존성 주입 (부품 조립) ---
	queries := db.New(dbpool)
	echomongService := service.NewEchomongService(queries)
	apiHandler := handler.NewApiHandler(echomongService)

	strictHandler := handler.NewStrictHandler(apiHandler, nil)

	// --- 5. Gin 라우터 설정 ---
	router := gin.Default()

	spec, err := handler.GetSwagger()
	if err != nil {
		log.Fatalf("OpenAPI 스펙 로드 실패: %v", err)
	}
	router.Use(ginmiddleware.OapiRequestValidator(spec))

	handler.RegisterHandlers(router, strictHandler)

	// --- 6. 서버 시작 ---
	log.Println("🚀 서버 실행 중... http://localhost:8080")
	http.ListenAndServe(":8080", router)
}
