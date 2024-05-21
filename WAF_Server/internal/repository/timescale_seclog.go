package repository

import (
	"waf_server/internal/model"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/pkg/pagination"
)

type TimescaleSeclog interface {
	Save(*timescale_model.SecLog) error
	List(pgn *pagination.Pagination[timescale_model.SecLog]) (*pagination.Pagination[timescale_model.SecLog], error)
	Count() (int64, error)
	FindByID(id string) (timescale_model.SecLog, error)
	OverviewSecLog(field string, timerange string, limit int) ([]model.EventCount, error)
}
