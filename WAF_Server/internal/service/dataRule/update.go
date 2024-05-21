package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func UpdateByID(id string, data model.Data, actor string) error {
	current, err := persistence.Data().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid data")
	}

	if current.Name != data.Name {
		return fmt.Errorf("should create new data instead update")
	}

	data.UpdatedAt = time.Now()
	err = persistence.Data().UpdateByID(data)
	if err != nil {
		return err
	}

	return service.CreateActions(current, data, id, "Data Rule", actor, model.ACTION_UPDATE)
}
