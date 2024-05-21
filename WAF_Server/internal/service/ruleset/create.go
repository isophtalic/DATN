package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/google/uuid"
)

func Create(rs model.RuleSet, actor string) error {
	srs_id := rs.SecRuleID_FK
	if len(srs_id) == 0 {
		return fmt.Errorf("invalid foreign_key")
	}

	rule, err := persistence.RuleSet().FindBySecRuleIDAndIdRule(srs_id, rs.ID)
	fmt.Println(rule)
	if err == nil {
		return fmt.Errorf("id %d is already existed", rs.ID)
	}

	rs.RuleID = uuid.NewString()
	rs.CreatedAt = time.Now()
	rs.UpdatedAt = time.Now()

	err = persistence.RuleSet().Save(rs)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, rs, rs.RuleID, "Rule", actor, model.ACTION_CREATE)
}
