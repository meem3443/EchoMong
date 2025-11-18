# --- 1단계: 빌드 스테이지 (오븐) ---
# Node.js 22 버전으로 프로젝트를 'build'합니다.
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_KAKAO_MAP_REST_KEY
ENV VITE_KAKAO_MAP_REST_KEY=${VITE_KAKAO_MAP_REST_KEY}

# 3. 'VITE_KAKAO_MAP_JS_KEY' 인수를 받겠다고 선언
ARG VITE_KAKAO_MAP_JS_KEY
ENV VITE_KAKAO_MAP_JS_KEY=${VITE_KAKAO_MAP_JS_KEY}

# docker-compose.yml의 context: ../frontend 를 기준으로 파일을 복사합니다.
COPY package*.json ./
RUN npm install

# .dockerignore 덕분에 node_modules는 제외됩니다.
COPY . .
RUN npm run build

# --- 2단계: 프로덕션 스테이지 (판매대) ---
# 1단계에서 빌드된 결과물('dist')만 Nginx 웹 서버로 복사합니다.
FROM nginx:alpine

# 1단계(builder)에서 /app/dist 에 있는 빌드 결과물을
# Nginx의 기본 HTML 폴더(/usr/share/nginx/html)로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx는 기본적으로 80 포트를 사용합니다.
EXPOSE 80

# Nginx 서버를 실행합니다.
CMD ["nginx", "-g", "daemon off;"]