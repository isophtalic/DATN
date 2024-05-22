package database

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresBlackListProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresBlackListProvider(tableName string, db interface{}) *PostgresBlackListProvider {
	database := db.(*postgres.Postgres).GetDB()
	BlacklistDatabase := &PostgresBlackListProvider{
		table: tableName,
		db:    database,
	}
	return BlacklistDatabase
}

func (repo *PostgresBlackListProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresBlackListProvider) Save(bl model.Blacklist) error {
	database := repo.db
	return database.Save(&bl).Error
}

func (repo *PostgresBlackListProvider) List() ([]model.Blacklist, error) {
	database := repo.db
	results := make([]model.Blacklist, 0)
	tx := database.Model(&model.Blacklist{}).Find(&results)

	if tx.Error != nil {
		return []model.Blacklist{}, tx.Error
	}

	return results, nil
}

func (repo *PostgresBlackListProvider) UpdateByID(id string, al model.Blacklist) error {
	db := repo.db

	tx := db.Where(&model.Blacklist{ID: id}).Select("ip", "status", "updated_at").Updates(&al)
	return tx.Error
}

func (repo *PostgresBlackListProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.Blacklist{}).Delete(&model.Blacklist{ID: id})

	return tx.Error
}

func (repo *PostgresBlackListProvider) DeleteByAccesslistID(id string) error {
	database := repo.db
	tx := database.Model(&model.Blacklist{}).Where("accesslist_id = ?", id).Delete(&model.Blacklist{AccessListID_FK: id})

	return tx.Error
}

func (repo *PostgresBlackListProvider) FindByAccesslistID(al_id string, pgn *pagination.Pagination[model.Blacklist]) (*pagination.Pagination[model.Blacklist], error) {
	database := repo.db

	results := make([]model.Blacklist, 0)
	tx := database.Scopes(pagination.Paginate(&model.Blacklist{}, pgn, database)).Where(&model.Blacklist{AccessListID_FK: al_id}).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Blacklist]{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return &pagination.Pagination[model.Blacklist]{}, fmt.Errorf("not found")
	}

	return pgn, nil
}

func (repo *PostgresBlackListProvider) FindByAccesslistAndIP(al_id, ip string) (model.Blacklist, error) {
	database := repo.db

	var result model.Blacklist
	tx := database.Where(&model.Blacklist{AccessListID_FK: al_id, IP: ip}).Find(&result)
	if tx.Error != nil {
		return model.Blacklist{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Blacklist{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}

func (repo *PostgresBlackListProvider) FindByIP(ip string) (model.Blacklist, error) {
	database := repo.db

	var result model.Blacklist
	tx := database.Where(&model.Blacklist{IP: ip}).Find(&result)
	if tx.Error != nil {
		return model.Blacklist{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Blacklist{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}

func (repo *PostgresBlackListProvider) FindByID(id string) (model.Blacklist, error) {
	database := repo.db

	var result model.Blacklist
	tx := database.Where(&model.Blacklist{ID: id}).Find(&result)
	if tx.Error != nil {
		return model.Blacklist{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Blacklist{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}
