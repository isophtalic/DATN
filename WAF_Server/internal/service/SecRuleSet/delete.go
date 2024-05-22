package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"

	"waf_server/internal/service"
)

func DeleteByID(id, actor string) error {
	_, err := persistence.SecRuleSet().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid security rule set")
	}

	err = persistence.RuleSet().DeleteBySecRuleID(id)
	if err != nil {
		return err
	}

	err = persistence.Data().DeleteBySecRuleID(id)
	if err != nil {
		return err
	}

	err = persistence.SecRuleSet().DeleteByID(id)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, nil, id, "Security Rule", actor, model.ACTION_DELETE)
}
