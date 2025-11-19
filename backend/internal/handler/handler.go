package handler

import (
	"backend/internal/service"
	"context"
	"errors"
	"fmt"
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

// internal/handler/handler.go

func (h *ApiHandler) RegisterUser(ctx context.Context, request RegisterUserRequestObject) (RegisterUserResponseObject, error) {
	user, err := h.userSvc.RegisterUser(
		ctx,
		string(request.Body.Email),
		request.Body.Username,
		request.Body.Password,
	)

	if err != nil {
		// ★ 디버깅: 에러 타입 확인
		fmt.Printf("Handler received error: %v\n", err)
		fmt.Printf("Handler error type: %T\n", err)

		var svcErr *service.ServiceError
		if errors.As(err, &svcErr) {
			fmt.Printf("ServiceError Code: %d\n", svcErr.Code)
			fmt.Printf("ServiceError Message: %s\n", svcErr.Message)

			errorMsg := svcErr.Message

			switch svcErr.Code {
			case 400:
				fmt.Println("Returning 400 response")
				return RegisterUser400JSONResponse{Error: errorMsg}, nil
			case 409:
				fmt.Println("Returning 409 response")
				return RegisterUser409JSONResponse{Error: errorMsg}, nil
			case 500:
				fmt.Println("Returning 500 response (from switch)")
				return RegisterUser500JSONResponse{Error: errorMsg}, nil
			}
		} else {
			fmt.Println("Failed to convert to ServiceError")
		}

		fmt.Println("Returning 500 response (default)")
		return RegisterUser500JSONResponse{Error: "서버 내부 오류"}, nil
	}

	return RegisterUser201JSONResponse{
		Email:    &user.Email,
		Username: &user.Username,
	}, nil
}

func (h *ApiHandler) LoginUser(ctx context.Context, request LoginUserRequestObject) (LoginUserResponseObject, error) {
	tokenString, err := h.userSvc.LoginUser(
		ctx,
		string(request.Body.Email),
		request.Body.Password,
	)

	if err != nil {
		var svcErr *service.ServiceError
		if errors.As(err, &svcErr) {
			errorMsg := svcErr.Message

			switch svcErr.Code {
			case 401:
				return LoginUser401JSONResponse{
					Error: errorMsg,
				}, nil
			case 500:
				return LoginUser500JSONResponse{
					Error: errorMsg,
				}, nil
			}
		}

		return LoginUser500JSONResponse{
			Error: "서버 내부 오류",
		}, nil
	}

	return LoginUser200JSONResponse{
		Token: tokenString,
	}, nil
}
