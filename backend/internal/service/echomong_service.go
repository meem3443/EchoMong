package service

import (
	// 1단계에서 'go mod init backend'를 했기 때문에
	// 프로젝트의 기본 경로는 'backend'가 됩니다.
	"backend/internal/repository/db"
	"context"
)

// EchomongService는 DB 쿼리 객체를 가집니다.
type EchomongService struct {
	queries *db.Queries
}

// Service 생성자
func NewEchomongService(queries *db.Queries) *EchomongService {
	return &EchomongService{queries: queries}
}

// (예시) ID로 에코몽 조회 로직
func (s *EchomongService) GetEchomongByID(ctx context.Context, id int64) (db.Echomong, error) {
	// 3단계에서 sqlc가 만든 GetEchomong 함수를 호출
	return s.queries.GetEchomong(ctx, id)
}
