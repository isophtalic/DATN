package database

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresSecRuleSetProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresSecRuleSetProvider(tablenName string, db interface{}) *PostgresSecRuleSetProvider {
	database := db.(*postgres.Postgres).GetDB()
	SRSDatabase := &PostgresSecRuleSetProvider{
		table: tablenName,
		db:    database,
	}
	return SRSDatabase
}

func (repo *PostgresSecRuleSetProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresSecRuleSetProvider) Save(srs model.SecurityRuleSet) error {
	database := repo.db
	return database.Save(&srs).Error
}

func (repo *PostgresSecRuleSetProvider) List(pgn *pagination.Pagination[model.SecurityRuleSet], valueSearch string) (*pagination.Pagination[model.SecurityRuleSet], error) {
	database := repo.db
	results := make([]model.SecurityRuleSet, 0)
	var tx *gorm.DB
	if valueSearch == "" {
		tx = database.Scopes(pagination.Paginate(&model.SecurityRuleSet{}, pgn, database)).Find(&results)
	} else {
		tx = database.Where("name LIKE ?", "%"+valueSearch+"%").Scopes(pagination.Paginate(&model.SecurityRuleSet{}, pgn, database)).Find(&results)
	}
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.SecurityRuleSet]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresSecRuleSetProvider) FindByID(id string) (model.SecurityRuleSet, error) {
	database := repo.db

	var result model.SecurityRuleSet
	tx := database.Where(&model.SecurityRuleSet{SecRuleID: id}).Find(&result)
	if tx.RowsAffected < 1 {
		return model.SecurityRuleSet{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresSecRuleSetProvider) FindByName(name string) (model.SecurityRuleSet, error) {
	database := repo.db

	var result model.SecurityRuleSet
	tx := database.Where(&model.SecurityRuleSet{Name: name}).First(&result)
	if tx.RowsAffected < 1 {
		return model.SecurityRuleSet{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresSecRuleSetProvider) UpdateByID(sr model.SecurityRuleSet) error {
	db := repo.db

	tx := db.Save(&sr)
	return tx.Error
}

func (repo *PostgresSecRuleSetProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.SecurityRuleSet{}).Delete(&model.SecurityRuleSet{SecRuleID: id})

	return tx.Error
}
