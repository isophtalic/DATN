package service

import (
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/google/uuid"
)

func Create(srs model.SecurityRuleSet, actor string) error {

	if srs.DebugLoglevel < 0 || srs.DebugLoglevel > 0 {
		srs.DebugLoglevel = 3
	}

	if err := srs.Valid(); err != nil {
		return err
	}

	srs.SecRuleID = uuid.NewString()
	srs.UpdatedAt = time.Now()
	srs.CreatedAt = time.Now()

	err := persistence.SecRuleSet().Save(srs)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, srs, srs.SecRuleID, "Rule", actor, model.ACTION_CREATE)
}
