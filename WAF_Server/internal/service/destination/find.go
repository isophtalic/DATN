package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
)

type ServiceDestinationHandler struct {
}

func (*ServiceDestinationHandler) List() ([]model.Destination, error) {
	return persistence.Destination().List()
}

func (*ServiceDestinationHandler) FindBySourceID(source_id string) (model.Destination, error) {
	return persistence.Destination().FindBySourceID(source_id)
}

func (*ServiceDestinationHandler) FindByID(id string) (model.Destination, error) {
	return persistence.Destination().FindByID(id)
}
