package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) (*pagination.Pagination[model.SecurityRuleSet], error) {
	pgn := pagination.NewPagination[model.SecurityRuleSet](c)

	return persistence.SecRuleSet().List(pgn, pgn.Search)
}

func FindByID(id string) (model.SecurityRuleSet, error) {
	return persistence.SecRuleSet().FindByID(id)
}

func FindByProxyID(id string) (model.SecurityRuleSet, error) {
	pr, err := persistence.Proxy().FindByID(id)
	if err != nil {
		return model.SecurityRuleSet{}, fmt.Errorf("invalid proxy")
	}
	return persistence.SecRuleSet().FindByID(pr.SecRuleID_FK)
}
