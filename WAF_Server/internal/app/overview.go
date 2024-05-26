package app

import (
	service "waf_server/internal/service/overview"

	"github.com/gin-gonic/gin"
)

type OverviewHandler struct{}

func (*OverviewHandler) Overview(c *gin.Context) {
	timerange := c.Query("timerange")
	if len(timerange) == 0 {
		timerange = "7 days"
	}
	data, err := service.ViewDefault(timerange)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", data)
}

func (*OverviewHandler) QueryByField(c *gin.Context) {
	timerange := c.Query("timerange")
	field := c.Query("field")

	data, err := service.OverviewByField(field, timerange)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", data)
}
