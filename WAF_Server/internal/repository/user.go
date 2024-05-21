package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type UserRepository interface {
	Save(user *model.User) error
	FindUserByID(id string) (model.User, error)
	FindUserByUsername(username string) (model.User, error)
	FindUserByEmail(email string) (model.User, error)
	ListUser(pgn *pagination.Pagination[model.UserResponse]) (*pagination.Pagination[model.UserResponse], error)
	UpdateByID(id string, cmd model.User) error
	DeleteByID(id string) error
}
