package app

import (
	"waf_server/internal/model"
	service_data "waf_server/internal/service/dataRule"

	"github.com/gin-gonic/gin"
)

type Datahandler struct{}

func (app *Datahandler) Create(c *gin.Context) {
	cmd := new(model.Data)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	err := service_data.Create(*cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", nil)
}

func (app *Datahandler) List(c *gin.Context) {
	result, err := service_data.List(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *Datahandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := service_data.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *Datahandler) FindBySecID(c *gin.Context) {
	id := c.Param("id")

	result, err := service_data.FindBySecRuleID(c, id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

// api update
func (app *Datahandler) UpdateByID(c *gin.Context) {
	id := c.Param("id")

	var cmd model.Data
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username
	err := service_data.UpdateByID(id, cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Updated", cmd.Name)
}

// api delete
func (app *Datahandler) DeleteByID(c *gin.Context) {
	id := c.Param("id")

	actor := c.MustGet("user").(model.User).Username
	err := service_data.DeleteByID(id, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Deleted", nil)
}
