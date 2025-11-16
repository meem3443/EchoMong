-- backend/internal/repository/queries/echomong.sql

-- name: GetEchomongByID :one
SELECT * FROM echomong
WHERE id = $1 LIMIT 1;

-- name: CreateEchomong :one
INSERT INTO echomong (
  title, lyrics, img_url
) VALUES (
  $1, $2, $3
)
RETURNING *;

-- name: GetMarkersByEchomongID :many
SELECT * FROM marker
WHERE echomong_id = $1;