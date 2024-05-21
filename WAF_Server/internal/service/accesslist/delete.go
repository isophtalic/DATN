package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func DeleteByID(id string, actor string) error {
	err := persistence.Blacklist().DeleteByAccesslistID(id)
	if err != nil {
		return err
	}

	err = persistence.Accesslist().DeleteByID(id)
	if err != nil {
		return err
	}
	return service.CreateActions(nil, nil, id, "Accesslist", actor, model.ACTION_UPDATE)

}
