package database

import (
	"fmt"
	"strings"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresRuleSetProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresRuleSetProvider(tablename string, db interface{}) *PostgresRuleSetProvider {
	database := db.(*postgres.Postgres).GetDB()

	RuleSetDatabase := &PostgresRuleSetProvider{
		table: tablename,
		db:    database,
	}

	return RuleSetDatabase
}

func (repo *PostgresRuleSetProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresRuleSetProvider) Save(rs model.RuleSet) error {
	database := repo.db
	return database.Save(&rs).Error
}

func (repo *PostgresRuleSetProvider) List(pgn *pagination.Pagination[model.RuleSet], valueSearch string) (*pagination.Pagination[model.RuleSet], error) {
	database := repo.db
	results := make([]model.RuleSet, 0)
	var tx *gorm.DB
	if len(strings.TrimSpace(valueSearch)) == 0 {
		tx = database.Scopes(pagination.Paginate(&model.RuleSet{}, pgn, database)).Find(&results)
	} else {
		tx = database.Where("file LIKE ?", "%"+valueSearch+"%").Scopes(pagination.Paginate(&model.RuleSet{}, pgn, database.Where("file LIKE ?", "%"+valueSearch+"%"))).Find(&results)
	}
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.RuleSet]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresRuleSetProvider) UpdateByID(rule model.RuleSet) error {
	db := repo.db

	tx := db.Save(&rule)
	return tx.Error
}

func (repo *PostgresRuleSetProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.RuleSet{}).Delete(&model.RuleSet{RuleID: id})

	return tx.Error
}

func (repo *PostgresRuleSetProvider) DeleteBySecRuleID(id string) error {
	database := repo.db
	tx := database.Model(&model.RuleSet{}).Where("secrule_id = ?", id).Delete(&model.RuleSet{SecRuleID_FK: id})
	return tx.Error
}

func (repo *PostgresRuleSetProvider) FindBySecRuleID(sr_id string, pgn *pagination.Pagination[model.RuleSet]) (*pagination.Pagination[model.RuleSet], error) {
	database := repo.db

	result := make([]model.RuleSet, 0)
	var tx *gorm.DB
	valueSearch := pgn.Search
	if len(strings.TrimSpace(valueSearch)) == 0 {
		tx = database.Where(&model.RuleSet{SecRuleID_FK: sr_id}).Scopes(pagination.Paginate(&model.RuleSet{}, pgn, database)).Find(&result)
	} else {
		tx = database.Where(&model.RuleSet{SecRuleID_FK: sr_id}).Where("file LIKE ?", "%"+valueSearch+"%").Scopes(pagination.Paginate(&model.RuleSet{}, pgn, database.Where(&model.RuleSet{SecRuleID_FK: sr_id}).Where("file LIKE ?", "%"+valueSearch+"%"))).Find(&result)
	}
	pgn.Records = result

	if tx.Error != nil {
		return &pagination.Pagination[model.RuleSet]{}, tx.Error
	}

	return pgn, nil

}
func (repo *PostgresRuleSetProvider) FindByID(id string) (model.RuleSet, error) {
	database := repo.db

	var result model.RuleSet
	tx := database.Model(&model.RuleSet{}).Where(&model.RuleSet{RuleID: id}).Find(&result)

	if tx.RowsAffected < 1 {
		return model.RuleSet{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresRuleSetProvider) FindBySecRuleIDAndIdRule(sr_id string, id int) (model.RuleSet, error) {
	database := repo.db
	var result model.RuleSet
	tx := database.Model(&model.RuleSet{}).Where("secrule_id = ?", sr_id).Where("id = ?", id).First(&result)
	if tx.Error != nil {
		return model.RuleSet{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.RuleSet{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}
