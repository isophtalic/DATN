package service

import (
	"fmt"
	"strings"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/asaskevich/govalidator"
)

func (cmd *ServiceProxyHandler) Update(id string, detail ProxyCreator, actor string) error {
	ok, err := govalidator.ValidateStruct(detail)
	if err != nil {
		return err
	}
	if !ok || len(strings.TrimSpace(detail.AccessListID_FK)) == 0 || len(strings.TrimSpace(detail.SecRuleID_FK)) == 0 {
		return fmt.Errorf("invalid input")
	}

	proxy, err := persistence.Proxy().FindByID(id)
	if err != nil {
		return fmt.Errorf("cannot find proxy")
	}

	src, err := persistence.Source().FindByProxyID(proxy.ProxyID)
	if err != nil {
		return fmt.Errorf("cannot find source")
	}

	dest, err := persistence.Destination().FindBySourceID(src.SourceID)
	if err != nil {
		return fmt.Errorf("cannot find destination")
	}

	if src.HostName != detail.Source.HostName || src.Port != detail.Source.Port {
		src.HostName = detail.Source.HostName
		src.Port = detail.Source.Port
		err = persistence.Source().UpdateByID(src)
		if err != nil {
			return err
		}
	}

	if dest.IP != detail.Destination.IP || dest.Scheme != detail.Destination.Scheme || dest.ForwardPort != detail.Destination.ForwardPort {
		dest.IP = detail.Destination.IP
		dest.Scheme = detail.Destination.Scheme
		dest.ForwardPort = detail.Destination.ForwardPort
		err = persistence.Destination().UpdateByID(dest)
		if err != nil {
			return err
		}
	}

	proxyUpdate := detail.Proxy
	proxyUpdate.UpdatedAt = time.Now()
	proxyUpdate.CreatedAt = detail.CreatedAt

	err = persistence.Proxy().UpdateByID(proxyUpdate.ProxyID, proxyUpdate)
	if err != nil {
		return err
	}

	return service.CreateActions(src, detail, detail.ProxyID, "Proxy", actor, model.ACTION_UPDATE)
}
