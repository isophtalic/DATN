package app

import (
	"waf_server/internal/model"
	serviceSource "waf_server/internal/service/source"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SourceHandler struct{}

func (*SourceHandler) CreateSource(c *gin.Context) {
	cmd := new(model.Source)

	if err := c.ShouldBindJSON(&cmd); err != nil {
		c.JSON(400, err)
		return
	}

	cmd.SourceID = uuid.NewString()
	err := serviceSource.Create(cmd.ProxyID_FK, *cmd)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", cmd.HostName)
}

func (*SourceHandler) ListSource(c *gin.Context) {

	sources, err := serviceSource.List(c)
	if err != nil {
		c.JSON(422, err.Error())
		return
	}

	c.JSON(200, gin.H{
		"message": "successfully",
		"data":    sources,
	})

}

func (*SourceHandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := serviceSource.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (*SourceHandler) FindByProxyID(c *gin.Context) {
	id := c.Param("id")
	result, err := serviceSource.FindByProxyID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}
