CREATE TABLE echomong (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    lyrics TEXT,
    img_url TEXT
);


CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- 비밀번호 해시값 저장
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now())
);