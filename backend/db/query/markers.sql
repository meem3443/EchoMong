-- name: GetAllMarkersWithEchomong :many
SELECT 
    m.id AS marker_id,
    m.latitude,
    m.longitude,
    e.title,
    e.img_url,
    e.lyrics
FROM markers m
JOIN echomong e ON m.echomong_id = e.id;