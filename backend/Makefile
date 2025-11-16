# backend/Makefile

# --- .env 파일 로드 (sqlc가 DB에 연결할 수 있도록) ---
# .env 파일을 include하고, 파일이 없으면 에러를 무시합니다.
-include .env
# .env의 모든 변수를 환경 변수로 export 합니다.
export
# --- .env 로드 끝 ---

# --- 변수 설정 ---
BINARY_NAME=backend
MAIN_GO=./main.go
OPENAPI_SPEC=openapi.yaml
SQLC_CONFIG=sqlc.yaml
GENERATED_API_FILE=internal/api/api.gen.go
GENERATED_DB_DIR=internal/repository/db

# --- .PHONY: 파일이 아닌 명령어(target)를 정의 ---
.PHONY: help default install-tools gen gen-api gen-db run build clean

# 'make'만 입력하면 'help' 명령어가 실행됩니다.
default: help

## help: 사용 가능한 명령어 목록을 보여줍니다.
help:
	@echo "사용 가능한 명령어:"
	@echo "  make install-tools - (최초 1회) oapi-codegen, sqlc 설치"
	@echo "  make gen           - (gen-api, gen-db) 모든 Go 코드 생성"
	@echo "  make gen-api       - OpenAPI 코드만 생성"
	@echo "  make gen-db        - DB (sqlc) 코드만 생성"
	@echo "  make run           - 코드 생성 후 서버 실행 (개발용)"
	@echo "  make build         - 코드 생성 후 바이너리 빌드 (배포용)"
	@echo "  make clean         - 생성된 파일 및 바이너리 삭제"

## install-tools: 개발에 필요한 도구들을 설치합니다.
install-tools:
	@echo "🔧 oapi-codegen (API 생성기) 설치 중..."
	@go get -tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest
	@echo "🔧 sqlc (DB 리포지토리 생성기) 설치 중..."
	@go get -tool github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	@echo "✅ 모든 도구 설치 완료!"

## gen: (수정) OpenAPI 및 DB 코드 모두 생성
gen: gen-api gen-db
	@echo "🧹 의존성 정리 중 (go mod tidy)..."
	@go mod tidy
	@echo "✅ 모든 코드 생성 완료!"

## gen-api: (신규) OpenAPI 코드 생성 (go generate 실행)
gen-api:
	@echo "🔧 OpenAPI 코드 생성 중 ($(GENERATED_API_FILE))..."
	@go generate ./...

## gen-db: (신규) DB(sqlc) 코드 생성
gen-db:
	@echo "🔧 DB 코드(sqlc) 생성 중 ($(GENERATED_DB_DIR))..."
	@echo "  - .env의 DB 정보로 sqlc 실행..."
	@go run github.com/sqlc-dev/sqlc/cmd/sqlc generate -f $(SQLC_CONFIG)

## run: (개발용) 서버를 실행합니다.
# 'gen'을 의존성으로 지정합니다.
run: gen
	@echo "🚀 서버 실행 중... (Ctrl+C로 종료)"
	@go run $(MAIN_GO)

## build: (배포용) 실행 바이너리를 빌드합니다.
build: gen
	@echo "🏗️  바이너리 빌드 중 ($(BINARY_NAME))..."
	@go build -o $(BINARY_NAME) $(MAIN_GO)
	@echo "✅ 빌드 완료! (./$(BINARY_NAME) 파일 생성)"

## clean: 생성된 파일과 빌드된 바이너리를 삭제합니다.
clean:
	@echo "🧹 정리 중..."
	@rm -f $(BINARY_NAME)
	@rm -f $(GENERATED_API_FILE)
	@rm -rf $(GENERATED_DB_DIR) # <--- 이 부분이 중요합니다
	@echo "✅ 정리 완료!"