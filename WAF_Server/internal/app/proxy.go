package app

import (
	"waf_server/internal/model"
	serviceProxy "waf_server/internal/service/proxy"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProxyHandler struct {
	Service *serviceProxy.ServiceProxyHandler
}

func (handler *ProxyHandler) CreateProxy(c *gin.Context) {
	cmd := new(serviceProxy.ProxyCreator)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	cmd.ProxyID = uuid.NewString()
	err := serviceProxy.Create(*cmd, c)
	if err != nil {
		ResponseError(c, err)
		return
	}
	c.JSON(200, gin.H{
		"message": "successfully",
	})
}

func (handler *ProxyHandler) ListProxy(c *gin.Context) {
	proxies, err := handler.Service.List(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", proxies)
}

func (handler *ProxyHandler) ViewProxy(c *gin.Context) {
	proxy_viewer, err := handler.Service.ViewProxy(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", proxy_viewer)
}

func (handler *ProxyHandler) ProxyDetail(c *gin.Context) {
	id := c.Param("id")
	result, err := handler.Service.ViewProxyDetail(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (handler *ProxyHandler) DeleteByID(c *gin.Context) {
	id := c.Param("id")
	actor := c.MustGet("user").(model.User).Username
	err := handler.Service.DeleteByID(id, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Deleted", nil)
}

func (handler *ProxyHandler) UpdateByID(c *gin.Context) {
	id := c.Param("id")
	cmd := new(serviceProxy.ProxyCreator)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	err := handler.Service.Update(id, *cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Updated", nil)
}
