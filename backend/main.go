// backend/main.go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"            // Chi 라우터
	"github.com/go-chi/chi/v5/middleware" // Chi 미들웨어
	"github.com/jackc/pgx/v5/pgxpool"     // PGX DB 풀
	"github.com/joho/godotenv"            // .env 파일 로더

	// --- 우리가 만든 계층들 ---
	"github.com/meem3443/EchoMong/backend/internal/api"           // 1. (gen-api) OpenAPI 코드
	"github.com/meem3443/EchoMong/backend/internal/handler"       // 3. 핸들러
	"github.com/meem3443/EchoMong/backend/internal/repository/db" // 2. (gen-db) Repository 코드
	"github.com/meem3443/EchoMong/backend/internal/service"       // 2. 서비스
)

func main() {
	// 1. .env 파일 로드
	if err := godotenv.Load(); err != nil {
		log.Println(" 경고: .env 파일을 찾을 수 없습니다.")
	}

	// 2. DB 연결 (Repository 준비)
	dbURL := os.Getenv("DATABASE_URL") // Makefile의 migrate와 동일한 변수 사용 권장
	if dbURL == "" {
		// sqlc.yaml과 동일하게 .env 변수로 조합
		dbURL = fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
			os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
	}

	dbpool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("DB 연결 실패: %v\n", err)
	}
	defer dbpool.Close()
	log.Println("✅ DB 연결 성공!")

	// --- 3. 의존성 주입 (계층 조립) ---

	// Repository (sqlc가 생성한 코드로 만듦)
	repository := db.New(dbpool)

	// Service (Repository를 주입)
	svc := service.NewService(repository)

	// Handler (Service를 주입)
	h := handler.NewHandler(svc)

	// --- 4. 라우터 설정 ---
	r := chi.NewRouter()
	r.Use(middleware.Logger) // 로그 미들웨어

	// openapi.yaml의 base path (/api/v1)에 맞춰 그룹화
	r.Group(func(r chi.Router) {
		// oapi-codegen이 생성한 HandlerFromMux 함수로 핸들러를 라우터에 등록
		api.HandlerFromMux(h, r)
	})

	// --- 5. 서버 시작 ---
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 서버 실행 중... (http://localhost:%s)\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("서버 시작 실패: %v\n", err)
	}
}
