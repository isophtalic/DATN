package database

import (
	"fmt"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresSourceProvider struct {
	db *gorm.DB
}

func NewPostgresSourceProvider(db interface{}) *PostgresSourceProvider {
	database := db.(*postgres.Postgres).GetDB()
	SourceDatabase := &PostgresSourceProvider{
		db: database,
	}

	return SourceDatabase
}

func (repo *PostgresSourceProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresSourceProvider) Save(proxy model.Source) error {
	database := repo.db
	return database.Save(&proxy).Error
}

func (repo *PostgresSourceProvider) List(pgn *pagination.Pagination[model.Source]) (*pagination.Pagination[model.Source], error) {
	database := repo.db
	results := make([]model.Source, 0)
	tx := database.Scopes(pagination.Paginate(&model.Source{}, pgn, database)).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Source]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresSourceProvider) FindByProxyID(proxy_id string) (model.Source, error) {
	database := repo.db
	var result model.Source
	tx := database.Model(&model.Source{}).Where(&model.Source{ProxyID_FK: proxy_id}).First(&result)
	fmt.Println(tx.RowsAffected)
	if tx.Error != nil {
		return model.Source{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Source{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}

func (repo *PostgresSourceProvider) FindByID(id string) (model.Source, error) {
	database := repo.db
	var result model.Source
	tx := database.Where(&model.Source{SourceID: id}).Find(&result)
	if tx.RowsAffected < 1 {
		return model.Source{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresSourceProvider) UpdateByID(src model.Source) error {
	database := repo.db
	tx := database.Save(&src)

	return tx.Error
}

func (repo *PostgresSourceProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.Source{}).Delete(&model.Source{SourceID: id})

	return tx.Error
}

func (repo *PostgresSourceProvider) FindByHostname(hostname string) (model.Source, error) {
	database := repo.db
	var result model.Source
	tx := database.Where(&model.Source{HostName: hostname}).Limit(1).Find(&result)
	if tx.Error != nil {
		return model.Source{}, tx.Error
	}

	if tx.RowsAffected == 0 {
		return model.Source{}, fmt.Errorf("not found")
	}

	return result, tx.Error
}

func (repo *PostgresSourceProvider) FindByHostnameAndPort(hostname, port string) (model.Source, error) {
	database := repo.db
	var result model.Source
	tx := database.Where(&model.Source{HostName: hostname, Port: port}).First(&result)
	if tx.RowsAffected == 0 {
		return model.Source{}, fmt.Errorf("not found")
	}

	if tx.Error != nil {
		return model.Source{}, tx.Error
	}

	return result, tx.Error
}

func (repo *PostgresSourceProvider) ExistByField(field, value string) (bool, error) {
	database := repo.db
	var result model.Source
	fieldquery := fmt.Sprintf("%s = ?", field)
	tx := database.Where(fieldquery, value).Find(&result)
	if tx.Error != nil {
		return false, tx.Error
	}

	return tx.RowsAffected > 0, nil
}
