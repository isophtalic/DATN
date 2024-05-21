package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
)

func (*ServiceDestinationHandler) Save(dest *model.Destination) error {
	if !dest.Valid() {
		return fmt.Errorf("some field is invalid")
	}

	_, err := persistence.Source().FindByID(dest.SourceID_FK)
	if err != nil {
		return fmt.Errorf("invalid source")
	}

	_, err = persistence.Destination().FindBySourceID(dest.SourceID_FK)
	if err == nil {
		return fmt.Errorf("exist destination in source")
	}

	return persistence.Destination().Save(dest)
}
