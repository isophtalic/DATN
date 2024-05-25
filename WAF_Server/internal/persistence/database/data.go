package database

import (
	"fmt"
	"strings"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresDataProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresDataProvider(tablename string, db interface{}) *PostgresDataProvider {
	database := db.(*postgres.Postgres).GetDB()

	DataDatabase := &PostgresDataProvider{
		table: tablename,
		db:    database,
	}

	return DataDatabase
}

func (repo *PostgresDataProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresDataProvider) Save(rs model.Data) error {
	database := repo.db
	return database.Save(&rs).Error
}

func (repo *PostgresDataProvider) List(pgn *pagination.Pagination[model.Data], valueSearch string) (*pagination.Pagination[model.Data], error) {
	database := repo.db
	results := make([]model.Data, 0)
	var tx *gorm.DB
	if len(strings.TrimSpace(valueSearch)) == 0 {
		tx = database.Scopes(pagination.Paginate(&model.Proxy{}, pgn, database)).Find(&results)
	} else {
		tx = database.Where("name LIKE ?", "%"+valueSearch+"%").Scopes(pagination.Paginate(&model.RuleSet{}, pgn, database.Where("name LIKE ?", "%"+valueSearch+"%"))).Find(&results)
	}
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Data]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresDataProvider) UpdateByID(data model.Data) error {
	db := repo.db

	tx := db.Save(&data)
	return tx.Error
}

func (repo *PostgresDataProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.Data{}).Delete(&model.Data{DataID: id})

	return tx.Error
}

func (repo *PostgresDataProvider) DeleteBySecRuleID(id string) error {
	database := repo.db
	tx := database.Model(&model.Data{}).Where("secrule_id = ?", id).Delete(&model.Data{SecRuleID_FK: id})
	return tx.Error
}

func (repo *PostgresDataProvider) FindBySecRuleID(sr_id string, pgn *pagination.Pagination[model.Data]) (*pagination.Pagination[model.Data], error) {
	database := repo.db

	results := make([]model.Data, 0)
	var tx *gorm.DB
	valueSearch := pgn.Search
	if len(strings.TrimSpace(valueSearch)) == 0 {
		tx = database.Where(&model.Data{SecRuleID_FK: sr_id}).Scopes(pagination.Paginate(&model.Data{}, pgn, database)).Find(&results)
	} else {
		tx = database.
			Where(&model.Data{SecRuleID_FK: sr_id}).
			Where("name LIKE ?", "%"+valueSearch+"%").
			Scopes(pagination.Paginate(&model.Data{}, pgn, database.Where(&model.Data{SecRuleID_FK: sr_id}).Where("name LIKE ?", "%"+valueSearch+"%"))).Find(&results)
	}

	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Data]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresDataProvider) FindByID(id string) (model.Data, error) {
	database := repo.db

	var result model.Data
	tx := database.Model(&model.Data{}).Where(&model.Data{DataID: id}).Find(&result)

	if tx.RowsAffected < 1 {
		return model.Data{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresDataProvider) FindBySecRuleIDAndData(sr_id string, name string) (model.Data, error) {
	database := repo.db

	var result model.Data
	tx := database.Model(&model.Data{}).Where(&model.Data{Name: name, SecRuleID_FK: sr_id}).Find(&result)
	if tx.Error != nil {
		return model.Data{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Data{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}
