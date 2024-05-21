package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func UpdateByID(id string, rule model.RuleSet, actor string) error {
	current, err := persistence.RuleSet().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid rule")
	}

	if current.ID != rule.ID || current.File != rule.File {
		return fmt.Errorf("should create new rule instead update")
	}

	rule.UpdatedAt = time.Now()
	err = persistence.RuleSet().UpdateByID(rule)
	if err != nil {
		return err
	}

	return service.CreateActions(current, rule, id, "Rule", actor, model.ACTION_UPDATE)
}
