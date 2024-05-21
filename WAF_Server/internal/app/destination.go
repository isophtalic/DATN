package app

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	service "waf_server/internal/service/destination"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type DestinationHandler struct {
	Service *service.ServiceDestinationHandler
}

func (handler *DestinationHandler) NewDestination(c *gin.Context) {
	var cmd = new(model.Destination)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	cmd.DestinationID = uuid.NewString()
	cmd.UpdatedAt = time.Now()

	err := handler.Service.Save(cmd)
	if err != nil {
		fmt.Println(err)
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", nil)
}

func (handler *DestinationHandler) List(c *gin.Context) {
	result, err := handler.Service.List()
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (handler *DestinationHandler) FindBySource(c *gin.Context) {
	id := c.Param("id")
	dest, err := handler.Service.FindBySourceID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", dest)
}

func (handler *DestinationHandler) FindByID(c *gin.Context) {
	id := c.Param("id")
	dest, err := handler.Service.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", dest)
}
