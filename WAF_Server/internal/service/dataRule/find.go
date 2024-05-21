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

func FindBySecRuleID(id string) ([]model.Data, error) {
	if _, err := persistence.SecRuleSet().FindByID(id); err != nil {
		return []model.Data{}, nil
	}

	return persistence.Data().FindBySecRuleID(id)
}
