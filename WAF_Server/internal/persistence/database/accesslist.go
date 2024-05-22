package database

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresAccessListProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresAccessListProvider(tableName string, db interface{}) *PostgresAccessListProvider {
	database := db.(*postgres.Postgres).GetDB()
	DesinationDatabase := &PostgresAccessListProvider{
		table: tableName,
		db:    database,
	}
	return DesinationDatabase
}

func (repo *PostgresAccessListProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresAccessListProvider) Save(des model.AccessList) error {
	database := repo.db
	return database.Save(&des).Error
}

func (repo *PostgresAccessListProvider) List(pgn *pagination.Pagination[model.AccessList]) (*pagination.Pagination[model.AccessList], error) {
	database := repo.db
	results := make([]model.AccessList, 0)
	tx := database.Scopes(pagination.Paginate(&model.AccessList{}, pgn, database)).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.AccessList]{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return &pagination.Pagination[model.AccessList]{}, fmt.Errorf("not found")
	}

	return pgn, nil
}

func (repo *PostgresAccessListProvider) UpdateByID(id string, al model.AccessList) error {
	db := repo.db

	tx := db.Where(&model.AccessList{AccessListID: id}).Select("name", "updated_at").Updates(&al)
	return tx.Error
}

func (repo *PostgresAccessListProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.AccessList{}).Delete(&model.AccessList{AccessListID: id})

	return tx.Error
}

func (repo *PostgresAccessListProvider) FindByName(name string) (model.AccessList, error) {
	database := repo.db

	var result model.AccessList

	tx := database.Where(&model.AccessList{Name: name}).Find(&result)
	if tx.Error != nil {
		return model.AccessList{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.AccessList{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}

func (repo *PostgresAccessListProvider) FindByID(id string) (model.AccessList, error) {
	database := repo.db

	var result model.AccessList
	tx := database.Where(&model.AccessList{AccessListID: id}).First(&result)
	if tx.Error != nil {
		return model.AccessList{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.AccessList{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}
