package repository

import (
	"waf_server/internal/model"
	"waf_server/internal/pkg/pagination"
)

type SecurityRuleSetRepository interface {
	Save(sec model.SecurityRuleSet) error
	List(pgn *pagination.Pagination[model.SecurityRuleSet]) (*pagination.Pagination[model.SecurityRuleSet], error)
	FindByID(id string) (model.SecurityRuleSet, error)
	FindByName(name string) (model.SecurityRuleSet, error)
	UpdateByID(sr model.SecurityRuleSet) error
	DeleteByID(id string) error
}

type RuleSetrepository interface {
	Save(rule model.RuleSet) error
	List(pgn *pagination.Pagination[model.RuleSet]) (*pagination.Pagination[model.RuleSet], error)
	UpdateByID(rule model.RuleSet) error
	FindBySecRuleID(sr_id string, pgn *pagination.Pagination[model.RuleSet]) (*pagination.Pagination[model.RuleSet], error)
	FindBySecRuleIDAndIdRule(sr_id string, id int) (model.RuleSet, error)
	FindByID(id string) (model.RuleSet, error)
	DeleteByID(id string) error
	DeleteBySecRuleID(id string) error
}

type DataRepository interface {
	Save(rule model.Data) error
	List(pgn *pagination.Pagination[model.Data]) (*pagination.Pagination[model.Data], error)
	UpdateByID(rule model.Data) error
	FindBySecRuleID(sr_id string, pgn *pagination.Pagination[model.Data]) (*pagination.Pagination[model.Data], error)
	FindByID(id string) (model.Data, error)
	DeleteByID(id string) error
	DeleteBySecRuleID(id string) error
	FindBySecRuleIDAndData(sr_id string, name string) (model.Data, error)
}
