package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func Find(c *gin.Context) (*pagination.Pagination[model.AccessList], error) {
	pgn := pagination.NewPagination[model.AccessList](c)
	return persistence.Accesslist().List(pgn)
}

type blacklist struct {
	IP     string `json:"ip"`
	Status int    `json:"status"`
}

type AccesslistDetail struct {
	model.AccessList
	Blacklist []blacklist `json:"blacklist"`
}

func FindByID(id string) (model.AccessList, error) {
	al, err := persistence.Accesslist().FindByID(id)
	if err != nil {
		fmt.Println(err)
	}

	return al, nil
}

func FindProxyUseAccesslist(id string, c *gin.Context) (*pagination.Pagination[model.ProxyViewer], error) {
	pgn := pagination.NewPagination[model.Proxy](c)
	var result = []model.ProxyViewer{}

	pgn, err := persistence.Proxy().FindByAccesslistID(id, pgn)
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

// func FindByProxyID(id string) (AccesslistDetail, error) {
// 	pr, err := persistence.Proxy().FindByID(id)
// 	if err != nil {
// 		return AccesslistDetail{}, fmt.Errorf("invalid proxy")
// 	}

// 	al, err := persistence.Accesslist().FindByID(pr.AccessListID_FK)
// 	if err != nil {
// 		return AccesslistDetail{}, err
// 	}

// 	bl, err := persistence.Blacklist().FindByAccesslistID(al.AccessListID)
// 	if err != nil {
// 		return AccesslistDetail{}, err
// 	}

// 	bls := []blacklist{}
// 	for _, v := range bl {
// 		bls = append(bls, blacklist{
// 			IP:     v.IP,
// 			Status: v.Status,
// 		})
// 	}

// 	return AccesslistDetail{
// 		AccessList: al,
// 		Blacklist:  bls,
// 	}, nil
// }
