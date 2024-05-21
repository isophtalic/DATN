package app

import (
	service "waf_server/internal/service/actions"

	"github.com/gin-gonic/gin"
)

type ActionsHandler struct{}

func (*ActionsHandler) ListActions(c *gin.Context) {
	result, err := service.ListActions(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)
}

func (*ActionsHandler) Detail(c *gin.Context) {
	id := c.Param("id")
	result, err := service.DetailAction(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)
}

func (*ActionsHandler) DetailByTarget(c *gin.Context) {
	id := c.Param("id")
	result, err := service.DetailActionByTarget(id, c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)
}
