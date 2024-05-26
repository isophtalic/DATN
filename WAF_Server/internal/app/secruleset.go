package app

import (
	"waf_server/internal/model"
	serviceSRS "waf_server/internal/service/SecRuleSet"

	"github.com/gin-gonic/gin"
)

type SecRuleSetHandler struct {
}

func (app *SecRuleSetHandler) Create(c *gin.Context) {
	cmd := new(model.SecurityRuleSet)
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	err := serviceSRS.Create(*cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Create sec_rule_set successfully", cmd.SecRuleID)
}

func (app *SecRuleSetHandler) List(c *gin.Context) {
	result, err := serviceSRS.List(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *SecRuleSetHandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := serviceSRS.FindByID(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func (app *SecRuleSetHandler) FindProxy(c *gin.Context) {
	id := c.Param("id")
	result, err := serviceSRS.FindProxyUseSecRule(id, c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Successfully", result)

}

func (app *SecRuleSetHandler) UpdateByID(c *gin.Context) {
	id := c.Param("id")
	var cmd model.SecurityRuleSet
	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	actor := c.MustGet("user").(model.User).Username

	err := serviceSRS.UpdateByID(id, cmd, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Updated", nil)
}

func (app *SecRuleSetHandler) DeleteByID(c *gin.Context) {
	id := c.Param("id")

	actor := c.MustGet("user").(model.User).Username

	err := serviceSRS.DeleteByID(id, actor)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Deleted", nil)
}
