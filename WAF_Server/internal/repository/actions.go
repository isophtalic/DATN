package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type ActionsReposiory interface {
	Save(bl model.Actions) error
	FindByID(id string) (model.Actions, error)
	FindByTargetID(id string, pgn *pagination.Pagination[model.Actions]) (*pagination.Pagination[model.Actions], error)
	List(pgn *pagination.Pagination[model.Actions]) (*pagination.Pagination[model.Actions], error)
}
