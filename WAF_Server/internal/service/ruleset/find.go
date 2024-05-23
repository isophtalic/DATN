package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) (*pagination.Pagination[model.RuleSet], error) {
	pgn := pagination.NewPagination[model.RuleSet](c)

	return persistence.RuleSet().List(pgn, pgn.Search)
}

func FindByID(id string) (model.RuleSet, error) {
	return persistence.RuleSet().FindByID(id)
}

func FindBySecRuleID(c *gin.Context, id string) (*pagination.Pagination[model.RuleSet], error) {
	pgn := pagination.NewPagination[model.RuleSet](c)

	if _, err := persistence.SecRuleSet().FindByID(id); err != nil {
		return nil, nil
	}

	return persistence.RuleSet().FindBySecRuleID(id, pgn)
}
