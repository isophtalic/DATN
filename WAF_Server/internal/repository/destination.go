package repository

import "waf_server/internal/model"

type DestinationRepository interface {
	Save(des *model.Destination) error
	List() ([]model.Destination, error)
	FindBySourceID(src_id string) (model.Destination, error)
	FindBySourceIDAndIP(src_id string, ip string) (model.Destination, error)
	FindByID(src_id string) (model.Destination, error)
	UpdateByID(dest model.Destination) error
	DeleteByID(id string) error
}
