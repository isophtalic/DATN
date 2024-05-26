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

func FindProxyUseSecRule(id string, c *gin.Context) (*pagination.Pagination[model.ProxyViewer], error) {
	pgn := pagination.NewPagination[model.Proxy](c)
	var result = []model.ProxyViewer{}

	// if pgn.Search != "" {
	pgn, err := persistence.Proxy().FindBySecRuleIDAndSearch(id, pgn)
	// }

	// pgn, err := persistence.Proxy().FindByAccesslistID(id, pgn)
	if err != nil {
		return nil, err
	}

	proxy := pgn.Records

	for _, proxy := range proxy {
		src, err := persistence.Source().FindByProxyID(proxy.ProxyID)
		if err != nil {
			return nil, err
		}

		dest, err := persistence.Destination().FindBySourceID(src.SourceID)
		if err != nil {
			return nil, err
		}

		secrule, err := persistence.SecRuleSet().FindByID(proxy.SecRuleID_FK)
		if err != nil {
			return nil, err
		}

		result = append(result, model.ProxyViewer{
			Hostname:    src.HostName,
			Port:        src.Port,
			Scheme:      dest.Scheme,
			Ip:          dest.IP,
			ForwardPort: dest.ForwardPort,
			Rule:        secrule.Name,
			Proxy:       proxy,
		})
	}

	return &pagination.Pagination[model.ProxyViewer]{
		Limit:      pgn.Limit,
		Page:       pgn.Page,
		TotalRows:  pgn.TotalRows,
		TotalPages: pgn.TotalPages,
		Sort:       pgn.Sort,
		Records:    result,
	}, nil
}
