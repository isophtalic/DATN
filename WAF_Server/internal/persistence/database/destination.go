package database

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"

	"gorm.io/gorm"
)

type PostgresDestinationProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresDestinationProvider(tablenName string, db interface{}) *PostgresDestinationProvider {
	database := db.(*postgres.Postgres).GetDB()
	DesinationDatabase := &PostgresDestinationProvider{
		table: tablenName,
		db:    database,
	}
	return DesinationDatabase
}

func (repo *PostgresDestinationProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresDestinationProvider) Save(des *model.Destination) error {
	database := repo.db
	return database.Save(&des).Error
}

func (repo *PostgresDestinationProvider) List() ([]model.Destination, error) {
	database := repo.db
	results := make([]model.Destination, 0)
	tx := database.Model(&model.Destination{}).Find(&results)

	if tx.Error != nil {
		return []model.Destination{}, tx.Error
	}

	return results, nil
}

func (repo *PostgresDestinationProvider) UpdateByID(dest model.Destination) error {
	db := repo.db

	tx := db.Save(&dest)
	return tx.Error
}

func (repo *PostgresDestinationProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.Destination{}).Delete(&model.Destination{DestinationID: id})

	return tx.Error
}

func (repo *PostgresDestinationProvider) FindBySourceID(src_id string) (model.Destination, error) {
	database := repo.db

	var result model.Destination
	tx := database.Where(&model.Destination{SourceID_FK: src_id}).First(&result)
	if tx.RowsAffected < 1 {
		return model.Destination{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresDestinationProvider) FindBySourceIDAndIP(src_id, ip string) (model.Destination, error) {
	database := repo.db

	var result model.Destination
	tx := database.Where(&model.Destination{SourceID_FK: src_id, IP: ip}).First(&result)
	if tx.RowsAffected < 1 {
		return model.Destination{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresDestinationProvider) FindByID(id string) (model.Destination, error) {
	database := repo.db

	var result model.Destination
	tx := database.Where(&model.Destination{DestinationID: id}).First(&result)
	if tx.RowsAffected < 1 {
		return model.Destination{}, gorm.ErrRecordNotFound
	}

	return result, tx.Error
}
