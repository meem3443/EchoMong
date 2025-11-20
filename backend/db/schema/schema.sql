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

