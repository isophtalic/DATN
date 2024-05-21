package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/google/uuid"
)

func Create(al model.AccessList, actor string) error {
	if !al.Valid() {
		return fmt.Errorf("invalid accesslist")
	}

	_, err := persistence.Accesslist().FindByName(al.Name)
	if err == nil {
		return fmt.Errorf("%s is already existed", al.Name)
	}

	al.AccessListID = uuid.NewString()
	al.UpdatedAt = time.Now()
	err = persistence.Accesslist().Save(al)
	if err != nil {
		return err
	}
	return service.CreateActions(nil, al, al.AccessListID, "Accesslist", actor, model.ACTION_CREATE)
}
