package handler

import (
	"backend/internal/service"
	"context"
)

type ApiHandler struct {
	echomongSvc *service.EchomongService
}

func NewApiHandler(svc *service.EchomongService) *ApiHandler {
	return &ApiHandler{echomongSvc: svc}
}

func (h *ApiHandler) GetEchomong(ctx context.Context, request GetEchomongRequestObject) (GetEchomongResponseObject, error) {

	id := request.Id

	dbEchomong, err := h.echomongSvc.GetEchomongByID(ctx, int64(id))
	if err != nil {
		return nil, err
	}

	// ---
	// DB 모델(sqlc) -> API 모델(oapi-codegen) "번역"
	// ---

	// ID ('int64' -> '*int')
	apiID := int(dbEchomong.ID)
	apiIDPtr := &apiID

	// Title ('pgtype.Text' -> '*string')
	var apiTitlePtr *string
	if dbEchomong.Title.Valid {
		apiTitlePtr = &dbEchomong.Title.String
	}

	// Lyrics ('pgtype.Text' -> '*string')
	var apiLyricsPtr *string
	if dbEchomong.Lyrics.Valid {
		apiLyricsPtr = &dbEchomong.Lyrics.String
	}

	// --- 이 부분이 추가되었습니다 ---
	// ImgUrl ('pgtype.Text' -> '*string')
	var apiImgUrlPtr *string
	if dbEchomong.ImgUrl.Valid {
		apiImgUrlPtr = &dbEchomong.ImgUrl.String
	}
	// --- --------------------- ---

	// 'api.gen.go'에 생성된 API용 'Echomong' 모델 생성
	apiModel := Echomong{
		Id:     apiIDPtr,
		Title:  apiTitlePtr,
		Lyrics: apiLyricsPtr,
		ImgUrl: apiImgUrlPtr, // 'img_url'이 아닌 'ImgUrl' (Go의 필드 이름)
	}

	response := GetEchomong200JSONResponse(apiModel)

	return response, nil
}
