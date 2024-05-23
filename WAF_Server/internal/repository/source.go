package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type SourceRepository interface {
	Save(source model.Source) error
	List(pgn *pagination.Pagination[model.Source], valueSearch string) (*pagination.Pagination[model.Source], error)
	FindByProxyID(proxy_id string) (model.Source, error)
	FindByID(id string) (model.Source, error)
	FindByHostname(hostname string) (model.Source, error)
	FindByHostnameAndPort(hostname, port string) (model.Source, error)
	ExistByField(field, value string) (bool, error)
	UpdateByID(src model.Source) error
	DeleteByID(id string) error
}
