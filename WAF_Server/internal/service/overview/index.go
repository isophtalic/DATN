package service

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence"
)

const defaultTime = "7 days"

type Overview struct {
	TotalHost      int64              `json:"total_host"`
	SecurityEvent  int64              `json:"total_secure_event"`
	TopAtkType     []model.EventCount `json:"top_attack_type"`
	TopByRuleID    []model.EventCount `json:"top_rule_id"`
	TopByHost      []model.EventCount `json:"top_by_host"`
	TopBySourceAtk []model.EventCount `json:"top_by_source_attack"`
}

func ViewDefault(timerange string) (*Overview, error) {
	totalHost, err := persistence.Proxy().Count()
	if err != nil {
		return &Overview{}, err
	}

	totalEvent, err := persistence.TimescaleSeclog().Count()
	if err != nil {
		return &Overview{}, err
	}

	top_attack_type, err := OverviewByField("mess", timerange)
	if err != nil {
		return &Overview{}, err
	}

	top_attack_rule, err := OverviewByField("rule_id", timerange)
	if err != nil {
		return &Overview{}, err
	}

	top_attack_host, err := OverviewByField("host", timerange)
	if err != nil {
		return &Overview{}, err
	}

	top_attack_source, err := OverviewByField("client_ip", timerange)
	if err != nil {
		return &Overview{}, err
	}

	return &Overview{
		TotalHost:      totalHost,
		SecurityEvent:  totalEvent,
		TopAtkType:     top_attack_type,
		TopByRuleID:    top_attack_rule,
		TopByHost:      top_attack_host,
		TopBySourceAtk: top_attack_source,
	}, nil
}

func OverviewByField(field, timerange string) ([]model.EventCount, error) {
	limit := 10
	if field == "host" || field == "client_ip" {
		limit = 4
	}

	dataraw, err := persistence.TimescaleSeclog().OverviewSecLog(field, timerange, limit)
	if err != nil {
		return []model.EventCount{}, err
	}

	return dataraw, nil
}
