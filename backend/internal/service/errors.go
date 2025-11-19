package service

import "fmt"

// ServiceError - HTTP 상태 코드를 포함하는 커스텀 에러
type ServiceError struct {
	Code    int    // HTTP 상태 코드 (400, 401, 409, 500 등)
	Message string // 에러 메시지
	Err     error  // 원본 에러 (optional)
}

func (e *ServiceError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// 에러 생성 헬퍼 함수들
func NewBadRequestError(message string) *ServiceError {
	return &ServiceError{Code: 400, Message: message}
}

func NewUnauthorizedError(message string) *ServiceError {
	return &ServiceError{Code: 401, Message: message}
}

func NewNotFoundError(message string) *ServiceError {
	return &ServiceError{Code: 404, Message: message}
}

func NewConflictError(message string) *ServiceError {
	return &ServiceError{Code: 409, Message: message}
}

func NewInternalError(message string, err error) *ServiceError {
	return &ServiceError{Code: 500, Message: message, Err: err}
}
