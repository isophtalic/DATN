package service

import (
	"errors"
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/google/uuid"
)

func Create(data model.Data, actor string) error {
	srs_id := data.SecRuleID_FK
	if len(srs_id) == 0 {
		return fmt.Errorf("invalid foreign_key")
	}

	_, err := persistence.SecRuleSet().FindByID(srs_id)
	if errors.Is(err, persistence.GormErrRecordNotFound) {
		return fmt.Errorf("error: record secruleset %s not found", srs_id)
	}

	_, err = persistence.Data().FindBySecRuleIDAndData(srs_id, data.Name)
	if err == nil {
		return fmt.Errorf("%s is already existed", data.Name)
	}

	data.DataID = uuid.NewString()
	data.CreatedAt = time.Now()
	data.UpdatedAt = time.Now()

	err = persistence.Data().Save(data)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, data, data.DataID, "Data", actor, model.ACTION_CREATE)
}
