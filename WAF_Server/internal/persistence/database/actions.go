package database

import (
	"fmt"
	"strings"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresActionsProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresActionsProvider(tableName string, db interface{}) *PostgresActionsProvider {
	database := db.(*postgres.Postgres).GetDB()

	ProxyDatabase := &PostgresActionsProvider{
		table: tableName,
		db:    database,
	}
	return ProxyDatabase
}

func (repo *PostgresActionsProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresActionsProvider) Save(action model.Actions) error {
	database := repo.db
	return database.Save(&action).Error
}

func (repo *PostgresActionsProvider) List(pgn *pagination.Pagination[model.Actions]) (*pagination.Pagination[model.Actions], error) {
	database := repo.db
	results := make([]model.Actions, 0)
	var tx *gorm.DB
	valueSearch := pgn.Search
	if len(strings.TrimSpace(valueSearch)) == 0 {
		tx = database.Scopes(pagination.Paginate(&model.Actions{}, pgn, database)).Find(&results)
	} else {
		tx = database.Where("name LIKE ?", "%"+valueSearch+"%").Or("target LIKE ?", "%"+valueSearch+"%").Scopes(pagination.Paginate(&model.Actions{}, pgn, database.Where("name LIKE ?", "%"+valueSearch+"%").Or("target LIKE ?", "%"+valueSearch+"%"))).Find(&results)
	}
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Actions]{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return &pagination.Pagination[model.Actions]{}, fmt.Errorf("not found")
	}

	return pgn, nil
}

func (repo *PostgresActionsProvider) FindByID(id string) (model.Actions, error) {
	database := repo.db

	var result model.Actions
	tx := database.Where(&model.Actions{ID: id}).First(&result)
	if tx.RowsAffected < 1 {
		return model.Actions{}, gorm.ErrRecordNotFound
	}

	return result, tx.Error
}

func (repo *PostgresActionsProvider) FindByTargetID(id string, pgn *pagination.Pagination[model.Actions]) (*pagination.Pagination[model.Actions], error) {
	database := repo.db
	results := make([]model.Actions, 0)
	tx := database.Where(&model.Actions{TargetID: id}).Scopes(pagination.Paginate(&model.Actions{}, pgn, database)).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Actions]{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return &pagination.Pagination[model.Actions]{}, fmt.Errorf("not found")
	}

	return pgn, nil
}
