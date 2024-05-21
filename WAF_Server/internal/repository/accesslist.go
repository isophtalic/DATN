package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type AccessListRepository interface {
	Save(model.AccessList) error
	List(pgn *pagination.Pagination[model.AccessList]) (*pagination.Pagination[model.AccessList], error)
	FindByID(id string) (model.AccessList, error)
	FindByName(name string) (model.AccessList, error)
	UpdateByID(id string, al model.AccessList) error
	DeleteByID(id string) error
}
