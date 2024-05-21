package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func DeleteByID(id string, actor string) error {
	_, err := persistence.Data().FindByID(id)
	if err != nil {
		return err
	}

	err = persistence.Data().DeleteByID(id)
	if err != nil {
		return err
	}
	return service.CreateActions(nil, nil, id, "Data Rule", actor, model.ACTION_DELETE)
}
