package handler

import (
	"backend/internal/service"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ApiHandler struct {
	echomongSvc *service.EchomongService
	userSvc     *service.UserService
}

func NewApiHandler(echomongSvc *service.EchomongService, userSvc *service.UserService) *ApiHandler {
	return &ApiHandler{
		echomongSvc: echomongSvc,
		userSvc:     userSvc,
	}
}

// --- Echomong Handler ---

func (h *ApiHandler) GetEchomong(ctx context.Context, request GetEchomongRequestObject) (GetEchomongResponseObject, error) {
	id := request.Id

	dbEchomong, err := h.echomongSvc.GetEchomongByID(ctx, int64(id))
	if err != nil {
		return nil, gin.Error{
			Err:  err,
			Type: gin.ErrorTypePublic,
			Meta: gin.H{"status": http.StatusNotFound, "message": "Not Found"},
		}
	}

	// --- "번역" 로직 ---
	apiID := int(dbEchomong.ID)
	apiIDPtr := &apiID

	var apiTitlePtr *string
	if dbEchomong.Title.Valid {
		apiTitlePtr = &dbEchomong.Title.String
	}

	var apiLyricsPtr *string
	if dbEchomong.Lyrics.Valid {
		apiLyricsPtr = &dbEchomong.Lyrics.String
	}

	var apiImgUrlPtr *string
	if dbEchomong.ImgUrl.Valid {
		apiImgUrlPtr = &dbEchomong.ImgUrl.String
	}

	apiModel := Echomong{
		Id:     apiIDPtr,
		Title:  apiTitlePtr,
		Lyrics: apiLyricsPtr,
		ImgUrl: apiImgUrlPtr,
	}
	response := GetEchomong200JSONResponse(apiModel)
	return response, nil
}

// --- User Handlers (수정됨) ---

func (h *ApiHandler) RegisterUser(ctx context.Context, request RegisterUserRequestObject) (RegisterUserResponseObject, error) {

	// ★ 1. 수정됨: *request.Body.Username -> request.Body.Username (포인터 아님)
	// (openapi.yaml의 스키마가 'type: string'이므로 oapi-codegen이 포인터가 아닌 'string'으로 생성함)
	user, err := h.userSvc.Register(ctx, request.Body.Username, request.Body.Password)
	if err != nil {
		return nil, gin.Error{
			Err:  err,
			Type: gin.ErrorTypePublic,
			Meta: gin.H{"status": http.StatusBadRequest, "message": "Failed to register"},
		}
	}

	// ★ 2. 수정됨: &user.ID -> apiIDPtr (int64 -> *int 변환)
	// (sqlc는 'int64', oapi-codegen은 '*int'를 사용하므로 타입 변환 필요)
	apiID := int(user.ID)
	apiIDPtr := &apiID

	apiUser := User{
		Id:       apiIDPtr,
		Username: &user.Username,
	}
	return RegisterUser201JSONResponse(apiUser), nil
}

func (h *ApiHandler) LoginUser(ctx context.Context, request LoginUserRequestObject) (LoginUserResponseObject, error) {

	// ★ 3. 수정됨: *request.Body.Username -> request.Body.Username (포인터 아님)
	tokenString, err := h.userSvc.Login(ctx, request.Body.Username, request.Body.Password)
	if err != nil {
		return nil, gin.Error{
			Err:  err,
			Type: gin.ErrorTypePublic,
			Meta: gin.H{"status": http.StatusUnauthorized, "message": "Invalid credentials"},
		}
	}

	return LoginUser200JSONResponse{Token: &tokenString}, nil
}
