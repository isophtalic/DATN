package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) (*pagination.Pagination[model.Data], error) {
	pgn := pagination.NewPagination[model.Data](c)

	return persistence.Data().List(pgn)
}

func FindByID(id string) (model.Data, error) {
	return persistence.Data().FindByID(id)
}

func FindBySecRuleID(c *gin.Context, id string) (*pagination.Pagination[model.Data], error) {
	pgn := pagination.NewPagination[model.Data](c)

	if _, err := persistence.SecRuleSet().FindByID(id); err != nil {
		return nil, nil
	}

	return persistence.Data().FindBySecRuleID(id, pgn)
}
