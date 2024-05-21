package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	pkg "waf_server/internal/pkg/error"

	"waf_server/internal/service"

	"gorm.io/gorm"
)

func DeleteByID(id, actor string) error {
	_, err := persistence.SecRuleSet().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid security rule set")
	}

	rs, err := persistence.RuleSet().FindBySecRuleID(id)
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}

	multipleErr := pkg.NewMultiplerror()

	for _, v := range rs {
		err := persistence.RuleSet().DeleteByID(v.RuleID)
		if err != nil {
			multipleErr.Append(err)
			continue
		}
	}

	if multipleErr.ErrorOrNil() != nil {
		return multipleErr.ErrorOrNil()
	}

	err = persistence.SecRuleSet().DeleteByID(id)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, nil, id, "Security Rule", actor, model.ACTION_DELETE)
}
