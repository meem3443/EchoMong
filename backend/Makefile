# --- 변수 설정 ---
OAPI_CONFIG=api/config.yaml
OAPI_SPEC=api/openapi.yaml
OAPI_GENERATED_FILE=internal/handler/api.gen.go

SQLC_CONFIG=sqlc.yaml
SQLC_GENERATED_DIR=internal/repository/db

# .PHONY: 이 명령어들이 실제 파일 이름이 아님을 명시 (필수)
.PHONY: help install-tools gen gen-api gen-db run clean

# --- 기본 명령어 ---
# 'make'만 입력하면 'help'가 실행됨
default: help

## help: 사용 가능한 명령어 목록
help:
	@echo "사용 가능한 명령어:"
	@echo "  make install-tools - sqlc와 oapi-codegen 설치"
	@echo "  make gen           - API 및 DB 코드 모두 생성"
	@echo "  make gen-api       - API 코드만 생성 (oapi-codegen)"
	@echo "  make gen-db        - DB 코드만 생성 (sqlc)"
	@echo "  make run           - (코드 생성 후) 서버 실행"
	@echo "  make clean         - 생성된 코드 모두 삭제"
	@echo "  make tidy          - go.mod 파일 정리"

## install-tools: 코드 생성기 도구 설치
install-tools:
	@echo "🔧 sqlc 설치 중..."
	@go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	@echo "🔧 oapi-codegen v2 설치 중..."
	@go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest
	@echo "✅ 모든 도구 설치 완료!"

## gen: 모든 코드 생성 (API와 DB)
gen: gen-api gen-db

## gen-api: OpenAPI 코드 생성 (4단계)
gen-api:
	@echo "🔧 API 코드 생성 중 ($(OAPI_GENERATED_FILE))..."
	@oapi-codegen -config $(OAPI_CONFIG) $(OAPI_SPEC)
	@echo "✅ API 코드 생성 완료!"

## gen-db: DB 코드 생성 (3단계)
gen-db:
	@echo "🔧 DB 코드 생성 중 ($(SQLC_GENERATED_DIR))..."
	@sqlc generate -f $(SQLC_CONFIG)
	@echo "✅ DB 코드 생성 완료!"

## tidy: go.mod 파일 정리 (7단계)
tidy:
	@echo "🧹 go.mod 및 go.sum 파일 정리 중..."
	@go mod tidy
	@echo "✅ 정리 완료!"

## run: 서버 실행 (7단계)
# 'run'은 'tidy'와 'gen'에 의존합니다.
# 'make run'을 실행하면 'make tidy', 'make gen'이 먼저 실행됩니다.
run: gen tidy
	@echo "🚀 서버 실행 중... (http://localhost:8080)"
	@go run ./main.go

## clean: 생성된 파일 삭제
clean:
	@echo "🧹 생성된 파일 삭제 중..."
	@rm -f $(OAPI_GENERATED_FILE)
	@rm -rf $(SQLC_GENERATED_DIR)
	@echo "✅ 삭제 완료!"