# --- 1단계: 빌드 스테이지 (Go 컴파일러) ---
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
# 소스 코드 '전부' 복사 (api/config.yaml 포함)
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/echomong-backend ./main.go


# --- 2단계: 프로덕션 스테이지 (경량 이미지) ---
FROM alpine:latest
WORKDIR /app

# 1단계에서 '빌드된 실행 파일'만 복사
COPY --from=builder /app/echomong-backend .

# 1단계에서 복사했던 '설정 파일'들을 1단계 이미지로부터 다시 복사
COPY --from=builder /app/api/config.yaml ./api/config.yaml
COPY --from=builder /app/api/openapi.yaml ./api/openapi.yaml

# ▼▼▼ .env 파일을 '물리적'으로 컨테이너에 복사 ▼▼▼
# build context(.)의 .env 파일을 /app/.env 로 복사
COPY .env .

# API 서버는 8000 포트를 사용한다고 가정
EXPOSE 8000
CMD ["./echomong-backend"]