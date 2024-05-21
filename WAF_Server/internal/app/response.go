package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const MESSAGE_INTERNAL_SERVER_ERROR = "Internal Server Error"

type ValidationError struct {
	Message string
}

type ProhibitionError struct {
	Message string
}

type AuthenticationError struct {
	Message string
}

func (e ValidationError) Error() string {
	if e.Message == "" {
		return "Validation Error"
	}
	return e.Message
}

func (e ProhibitionError) Error() string {
	if e.Message == "" {
		return "Prohibition Error"
	}
	return e.Message
}

func (e AuthenticationError) Error() string {
	if e.Message == "" {
		return "Authentication Error"
	}
	return e.Message
}

type ResponseBody struct {
	Message string      `json:"message"`
	Code    int         `json:"code"`
	Data    interface{} `json:"data,omitempty"`
}

func ResponseError(c *gin.Context, err error) {
	switch err := err.(type) {
	case ValidationError:
		c.JSON(http.StatusUnprocessableEntity, ResponseBody{
			Code:    http.StatusUnprocessableEntity,
			Message: err.Error(),
		})
		return
	case ProhibitionError:
		c.JSON(http.StatusForbidden, ResponseBody{
			Code:    http.StatusForbidden,
			Message: err.Error(),
		})
		return

	case AuthenticationError:
		c.JSON(http.StatusUnauthorized, ResponseBody{
			Code:    http.StatusUnauthorized,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusUnprocessableEntity, ResponseBody{
		Code:    http.StatusUnprocessableEntity,
		Message: err.Error(),
	})
}

func ResponseJSON(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, ResponseBody{
		Code:    200,
		Message: message,
		Data:    data,
	})
}
