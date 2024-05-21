package app

import (
	"waf_server/internal/model"
	service_rs "waf_server/internal/service/ruleset"

	"github.com/gin-gonic/gin"
)

type RuleSethandler struct{}

func (app *RuleSethandler) Create(c *gin.Context) {
	cmd := new(model.RuleSet)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	err := service_rs.Create(*cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", cmd.RuleID)
}

func (app *RuleSethandler) List(c *gin.Context) {
	result, err := service_rs.List(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *RuleSethandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := service_rs.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *RuleSethandler) FindBySecID(c *gin.Context) {
	id := c.Param("id")

	result, err := service_rs.FindBySecRuleID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

// api update
func (app *RuleSethandler) UpdateByID(c *gin.Context) {
	id := c.Param("id")

	var cmd model.RuleSet
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username
	err := service_rs.UpdateByID(id, cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Updated", cmd.File)
}

// api delete
func (app *RuleSethandler) DeleteByID(c *gin.Context) {
	id := c.Param("id")

	actor := c.MustGet("user").(model.User).Username
	err := service_rs.DeleteByID(id, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Deleted", nil)
}
