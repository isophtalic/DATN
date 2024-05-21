package actions

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

func ListActions(c *gin.Context) (*pagination.Pagination[model.Actions], error) {
	pgn := pagination.NewPagination[model.Actions](c)
	return persistence.Actions().List(pgn)
}

func DetailAction(id string) (model.Actions, error) {
	return persistence.Actions().FindByID(id)
}

func DetailActionByTarget(target_id string, c *gin.Context) (*pagination.Pagination[model.Actions], error) {
	pgn := pagination.NewPagination[model.Actions](c)
	return persistence.Actions().FindByTargetID(target_id, pgn)
}
