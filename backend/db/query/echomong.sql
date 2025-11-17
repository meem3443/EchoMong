-- db/query/echomong.sql
-- name: GetEchomong :one
SELECT * FROM echomong
WHERE id = $1 LIMIT 1;