package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) (*pagination.Pagination[model.UserResponse], error) {
	pgn := pagination.NewPagination[model.UserResponse](c)

	return persistence.User().ListUser(pgn)
}

func FindByUsername(username string) (model.User, error) {
	return persistence.User().FindUserByUsername(username)
}

func FindByEmail(email string) (model.User, error) {
	return persistence.User().FindUserByEmail(email)
}
