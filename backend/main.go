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

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	ginmiddleware "github.com/oapi-codegen/gin-middleware" // ★ 'spec'을 사용하기 위해 필요
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

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPass, dbHost, dbPort, dbName,
	)

	// --- 3. DB 연결 ---
	dbpool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}
	defer dbpool.Close()

	// --- 4. 의존성 주입 (v2.5.1 호환) ---
	queries := db.New(dbpool)

	// ★ 1. Service들 생성
	echomongService := service.NewEchomongService(queries)
	userService := service.NewUserService(queries) // UserService 생성

	// ★ 2. Handler 생성
	apiHandler := handler.NewApiHandler(echomongService, userService)

	// ★ 3. 인증 미들웨어 (v2.5.1에서는 옵션으로 주입 안 함)
	// authMiddleware := handler.NewAuthMiddleware() // ⬅️ 'declared and not used' 오류 방지를 위해 주석 처리

	// ★ 4. oapi-codegen 미들웨어 옵션 (v2.5.1에서는 사용 안 함)
	// (StrictHTTPServerOptions, RequestPipe 등 관련 코드 모두 삭제)

	// ★ 5. StrictHandler 생성 (v2.5.1 호환 방식)
	// NewStrictHandlerWithOptions 대신 NewStrictHandler 사용
	strictHandler := handler.NewStrictHandler(apiHandler, nil)

	// --- 5. Gin 라우터 설정 ---
	router := gin.Default()

	// ★ 'spec' 변수 선언 및 사용
	spec, err := handler.GetSwagger() // ⬅️ 'spec' 선언
	if err != nil {
		log.Fatalf("OpenAPI 스펙 로드 실패: %v", err)
	}

	// ★ 'spec' 변수 사용 (이 줄이 있어야 'declared and not used: spec' 오류가 안 남)
	router.Use(ginmiddleware.OapiRequestValidator(spec)) // ⬅️ 'spec' 사용

	// ★ 6. 라우터 등록
	handler.RegisterHandlers(router, strictHandler)

	// --- 6. 서버 시작 ---
	log.Println("🚀 서버 실행 중... http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
