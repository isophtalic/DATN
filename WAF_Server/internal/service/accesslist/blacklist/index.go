package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"
	"waf_server/internal/service"

	"github.com/gin-gonic/gin"
)

type ServiceBlacklistHandler struct{}

func (*ServiceBlacklistHandler) CreateBlackist(bl model.Blacklist, actor string) error {
	if _, err := persistence.Accesslist().FindByID(bl.AccessListID_FK); err != nil {
		return fmt.Errorf("invalid accesslist")
	}

	if _, err := persistence.Blacklist().FindByAccesslistAndIP(bl.AccessListID_FK, bl.IP); err == nil {
		return fmt.Errorf("ip is exist")
	}
	err := persistence.Blacklist().Save(bl)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, bl, bl.ID, "Blacklist", actor, model.ACTION_CREATE)

}

func (*ServiceBlacklistHandler) List(al_id string, c *gin.Context) (*pagination.Pagination[model.Blacklist], error) {
	_, err := persistence.Accesslist().FindByID(al_id)
	if err != nil {
		return nil, fmt.Errorf("invalid accesslist")
	}

	pgn := pagination.NewPagination[model.Blacklist](c)

	return persistence.Blacklist().FindByAccesslistID(al_id, pgn)
}

func (*ServiceBlacklistHandler) UpdateByID(bl_id string, input model.Blacklist, actor string) error {
	src, err := persistence.Blacklist().FindByID(bl_id)
	if err != nil {
		return fmt.Errorf("invalid blacklist")
	}

	err = persistence.Blacklist().UpdateByID(bl_id, input)
	if err != nil {
		return err
	}

	return service.CreateActions(src, input, bl_id, "Blacklist", actor, model.ACTION_CREATE)
}
