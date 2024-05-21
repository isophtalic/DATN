package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func UpdateByID(id string, al model.AccessList, actor string) error {
	if !al.Valid() {
		return fmt.Errorf("invalid accesslist")
	}

	current, err := persistence.Accesslist().FindByID(id)
	if err != nil {
		return fmt.Errorf("accesslist not exist")
	}

	_, err = persistence.Accesslist().FindByName(al.Name)
	if err == nil {
		return fmt.Errorf("%s is already existed", al.Name)
	}

	al.UpdatedAt = time.Now()
	err = persistence.Accesslist().UpdateByID(id, al)
	if err != nil {
		return err
	}

	return service.CreateActions(current, al, al.AccessListID, "Accesslist", actor, model.ACTION_UPDATE)
}
