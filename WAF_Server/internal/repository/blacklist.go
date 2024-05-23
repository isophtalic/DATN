package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type BlacklistReposiory interface {
	Save(bl model.Blacklist) error
	List() ([]model.Blacklist, error)
	UpdateByID(id string, al model.Blacklist) error
	DeleteByAccesslistID(id string) error
	DeleteByID(id string) error
	FindByAccesslistID(al_id string, pgn *pagination.Pagination[model.Blacklist], valueSearch string) (*pagination.Pagination[model.Blacklist], error)
	FindByAccesslistAndIP(al_id, ip string) (model.Blacklist, error)
	FindByIP(ip string) (model.Blacklist, error)
	FindByID(ip string) (model.Blacklist, error)
}
