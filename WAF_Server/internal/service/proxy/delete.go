package service

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"
)

func (*ServiceProxyHandler) DeleteByID(id string, actor string) error {
	_, err := persistence.Proxy().FindByID(id)
	if err != nil {
		return fmt.Errorf("invalid proxy")
	}

	// if px.Status {
	// 	return fmt.Errorf("proxy is active")
	// }

	// delete source
	source, err := persistence.Source().FindByProxyID(id)
	fmt.Println("🚀 ~ func ~ source:", source)
	fmt.Println(err)
	if err == nil {
		err = persistence.Source().DeleteByID(source.SourceID)
		if err != nil {
			return fmt.Errorf("invalid proxy")
		}
	}

	// delete destination
	destination, err := persistence.Destination().FindBySourceID(source.SourceID)
	if err == nil {
		err = persistence.Destination().DeleteByID(destination.DestinationID)
		if err != nil {
			return fmt.Errorf("invalid proxy")
		}
	}

	err = persistence.Proxy().Delete(id)
	if err != nil {
		return err
	}

	return service.CreateActions(nil, nil, id, "Proxy", actor, model.ACTION_DELETE)
}
