package app

import (
	"fmt"
	"net/http"
	"strings"
	"waf_server/internal/configs"
	"waf_server/internal/model"
	service "waf_server/internal/service/user"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct{}

func (*AuthHandler) Login(c *gin.Context) {
	auth := new(service.AuthRequest)
	if err := c.ShouldBindJSON(&auth); err != nil {
		ResponseError(c, err)
		return
	}
	ctn := configs.GetContainerVar()
	token, err := auth.Login(ctn.JWT_Sercret)
	if err != nil {
		ResponseError(c, AuthenticationError{
			Message: err.Error(),
		})
		return
	}

	ResponseJSON(c, "", token)
}

type UserHandler struct{}

func (*UserHandler) CreateAccount(c *gin.Context) {
	acc := new(service.AccountRequest)
	if err := c.ShouldBindJSON(&acc); err != nil {
		ResponseError(c, err)
		return
	}

	err := service.Create(acc, c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created Account", ResponseBody{
		Data: acc.Username,
		Code: http.StatusOK,
	})
}

func (*UserHandler) ListUser(c *gin.Context) {
	actor := c.MustGet("user").(model.User)
	if actor.Role != 0 {
		ResponseError(c, ProhibitionError{Message: "Action not allowed"})
		return
	}

	email := strings.TrimSpace(c.Query("email"))
	username := c.Query("username")

	if email != "" && username == "" {
		user, err := service.FindByEmail(email)
		if err != nil {
			ResponseError(c, err)
			return
		}

		ResponseJSON(c, "", user)
		return
	}

	if email == "" && username != "" {
		user, err := service.FindByEmail(email)
		if err != nil {
			ResponseError(c, err)
			return
		}

		ResponseJSON(c, "", user)
		return
	}

	users, err := service.List(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", users)
}

func (*UserHandler) ResetPassword(c *gin.Context) {
	actor := c.MustGet("user").(model.User)
	if actor.Role != 0 {
		ResponseError(c, ProhibitionError{Message: "Action not allowed"})
		return
	}

	id := c.Param("id")

	err := service.ResetPassword(id)
	if err != nil {
		ResponseError(c, fmt.Errorf("can't reset password"))
		return
	}

	ResponseJSON(c, "Successfully", nil)
}

func (*UserHandler) DeleteByID(c *gin.Context) {
	actor := c.MustGet("user").(model.User)
	if actor.Role != 0 {
		ResponseError(c, ProhibitionError{Message: "Action not allowed"})
		return
	}

	id := c.Param("id")

	err := service.Delete(id)
	if err != nil {
		ResponseError(c, fmt.Errorf("can't delete user"))
		return
	}

	ResponseJSON(c, "Deleted", nil)
}
