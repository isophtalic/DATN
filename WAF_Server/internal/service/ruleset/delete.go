package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func DeleteByID(id string, actor string) error {
	_, err := persistence.RuleSet().FindByID(id)
	if err != nil {
		return err
	}

	err = persistence.RuleSet().DeleteByID(id)
	if err != nil {
		return err
	}
	return service.CreateActions(nil, nil, id, "Security Rule", actor, model.ACTION_DELETE)
}
