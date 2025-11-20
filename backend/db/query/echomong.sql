-- db/query/echomong.sql
-- name: GetEchomong :one
SELECT * FROM echomong
WHERE id = $1 LIMIT 1;

-- name: GetEchomongs :many
SELECT * FROM echomong
ORDER BY id; 

-- name: GetEchomongByTitle :one
SELECT id FROM echomong WHERE title = $1 LIMIT 1;