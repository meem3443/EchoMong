CREATE TABLE echomong (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    lyrics TEXT,
    img_url TEXT
);


CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  team BIGINT
);


CREATE TABLE markers (
    id BIGSERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,  -- 위도 (소수점 정밀도 필요)
    longitude DOUBLE PRECISION NOT NULL, -- 경도
    
    -- 이 마커가 어떤 에코몽(캐릭터/쓰레기통)인지 연결
    echomong_id BIGINT NOT NULL REFERENCES echomong(id) ON DELETE CASCADE
);