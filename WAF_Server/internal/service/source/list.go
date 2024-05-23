package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
)

type SourceDetail struct {
	model.Source
	Destination model.Destination `json:"destination"`
}

func List(c *gin.Context) (*pagination.Pagination[model.Source], error) {
	pgn := pagination.NewPagination[model.Source](c)
	return persistence.Source().List(pgn, pgn.Search)
}

func FindByProxyID(id string) (SourceDetail, error) {
	source, err := persistence.Source().FindByProxyID(id)
	if err != nil {
		return SourceDetail{}, err
	}

	dest, err := persistence.Destination().FindBySourceID(source.SourceID)
	if err != nil {
		return SourceDetail{}, err
	}

	return SourceDetail{
		Source:      source,
		Destination: dest,
	}, nil
}

func FindByID(id string) (SourceDetail, error) {
	source, err := persistence.Source().FindByID(id)
	if err != nil {
		return SourceDetail{}, err
	}

	dest, err := persistence.Destination().FindBySourceID(id)
	if err != nil {
		dest = model.Destination{}
		// return SourceDetail{}, err
	}

	return SourceDetail{
		Source:      source,
		Destination: dest,
	}, nil
}
