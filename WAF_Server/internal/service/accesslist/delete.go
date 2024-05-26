package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"
	"waf_server/internal/service"

	"github.com/gin-gonic/gin"
)

func DeleteByID(id string, actor string) error {
	pgn := pagination.NewPagination[model.Proxy](&gin.Context{})
	proxies, err := persistence.Proxy().FindByAccesslistID(id, pgn)
	if err != nil {
		return err
	}

	if proxies.TotalRows > 0 {
		return fmt.Errorf("some proxies use this accesslist")
	}

	err = persistence.Blacklist().DeleteByAccesslistID(id)
	if err != nil {
		return err
	}

	err = persistence.Accesslist().DeleteByID(id)
	if err != nil {
		return err
	}
	return service.CreateActions(nil, nil, id, "Accesslist", actor, model.ACTION_UPDATE)

}
