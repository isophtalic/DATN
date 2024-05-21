package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func UpdateByID(id string, srs model.SecurityRuleSet, actor string) error {
	if id != srs.SecRuleID {
		return fmt.Errorf("action not allowed")
	}

	current, err := persistence.SecRuleSet().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid security rule set")
	}

	_, err = persistence.SecRuleSet().FindByName(srs.Name)
	if err == nil {
		return fmt.Errorf("security is already exist")
	}

	if err := srs.Valid(); err != nil {
		return err
	}

	srs.UpdatedAt = time.Now()

	err = persistence.SecRuleSet().UpdateByID(srs)
	if err != nil {
		return err
	}

	return service.CreateActions(current, srs, id, "Security Rule", actor, model.ACTION_UPDATE)

}
