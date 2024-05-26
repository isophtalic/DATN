package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type ProxyRepository interface {
	Save(proxy model.Proxy) error
	Count() (int64, error)
	List(pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error)
	FindByID(id string) (model.Proxy, error)
	FindByAccesslistID(id string, pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error)
	FindByAccesslistIDAndSearch(id string, pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error)
	FindBySecRuleIDAndSearch(id string, pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error)
	UpdateStatusByID(id string, status bool) error
	UpdateByID(id string, proxy model.Proxy) error
	Delete(id string) error
}
