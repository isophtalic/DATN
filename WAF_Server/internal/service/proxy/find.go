package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
)

func (*ServiceProxyHandler) FindByID(id string) (model.Proxy, error) {
	return persistence.Proxy().FindByID(id)
}
