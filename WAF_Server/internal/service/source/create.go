package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
)

func Create(proxy_id string, source model.Source) error {
	_, err := persistence.Source().FindByHostname(source.HostName)
	if err == nil {
		return fmt.Errorf("dublicate source")
	}

	_, err = persistence.Source().FindByProxyID("proxy_id")
	if err != nil {
		return fmt.Errorf("error: exist source for proxy %s", source.ProxyID_FK)
	}

	if !source.Valid() {
		return fmt.Errorf("some field is invalid")
	}

	source.CreatedAt = time.Now()
	source.UpdatedAt = time.Now()

	return persistence.Source().Save(source)
}
