package app

import (
	"fmt"
	"waf_server/internal/model"
	service "waf_server/internal/service/accesslist"
	serviceBlackist "waf_server/internal/service/accesslist/blacklist"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AccesslistHandler struct {
	ServiceBlacklist serviceBlackist.ServiceBlacklistHandler
}

func (*AccesslistHandler) CreateAccesslist(c *gin.Context) {
	var accesslist model.AccessList
	err := c.ShouldBindJSON(&accesslist)
	if err != nil {
		ResponseError(c, err)
		return
	}
	actor := c.MustGet("user").(model.User).Username
	err = service.Create(accesslist, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", accesslist.Name)
}

func (*AccesslistHandler) List(c *gin.Context) {
	acls, err := service.Find(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", acls)
}

func (app *AccesslistHandler) DetailAccesslist(c *gin.Context) {
	id := c.Param("id")
	result, err := service.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

// func (app *AccesslistHandler) FindByProxyID(c *gin.Context) {
// 	id := c.Param("id")
// 	result, err := service.FindByProxyID(id)
// 	if err != nil {
// 		ResponseError(c, err)
// 		return
// 	}

// 	ResponseJSON(c, "", result)
// }

func (app *AccesslistHandler) FindProxy(c *gin.Context) {
	id := c.Param("id")
	result, err := service.FindProxyUseAccesslist(id, c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)

}

func (app *AccesslistHandler) CreateBlackist(c *gin.Context) {
	cmd := new(model.Blacklist)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	cmd.ID = uuid.NewString()
	err := app.ServiceBlacklist.CreateBlackist(*cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, fmt.Sprintf("Added %s", cmd.IP), nil)
}

func (app *AccesslistHandler) FindBlacklist(c *gin.Context) {
	id := c.Param("id")
	result, err := app.ServiceBlacklist.List(id, c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)
}
