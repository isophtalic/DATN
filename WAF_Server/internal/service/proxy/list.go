package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

type ServiceProxyHandler struct{}

func (cmd *ServiceProxyHandler) List(c *gin.Context) (*pagination.Pagination[model.Proxy], error) {
	pgn := pagination.NewPagination[model.Proxy](c)
	return persistence.Proxy().List(pgn)
}

func (cmd *ServiceProxyHandler) ViewProxy(c *gin.Context) (*pagination.Pagination[model.ProxyViewer], error) {
	pgn := pagination.NewPagination[model.Proxy](c)

	var result = []model.ProxyViewer{}
	pgn, err := persistence.Proxy().List(pgn)
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

func (cmd *ServiceProxyHandler) ViewProxyDetail(id string) (model.ProxyViewerDetail, error) {

	proxy, err := persistence.Proxy().FindByID(id)
	if err != nil {
		return model.ProxyViewerDetail{}, err
	}

	src, err := persistence.Source().FindByProxyID(proxy.ProxyID)
	if err != nil {
		return model.ProxyViewerDetail{}, err
	}

	dest, err := persistence.Destination().FindBySourceID(src.SourceID)
	if err != nil {
		return model.ProxyViewerDetail{}, err
	}

	secrule, err := persistence.SecRuleSet().FindByID(proxy.SecRuleID_FK)
	if err != nil {
		return model.ProxyViewerDetail{}, err
	}

	accesslist, err := persistence.Accesslist().FindByID(proxy.AccessListID_FK)
	if err != nil {
		fmt.Println(proxy.AccessListID_FK)
		return model.ProxyViewerDetail{}, err
	}

	result := model.ProxyViewerDetail{
		Proxy:       proxy,
		Source:      src,
		Destination: dest,
		SecRule:     secrule,
		Acesslist:   accesslist,
	}

	return result, nil
}
