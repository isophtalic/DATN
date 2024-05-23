package database

import (
	"strings"
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type PostgresProxyProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresProxyProvider(tableName string, db interface{}) *PostgresProxyProvider {
	database := db.(*postgres.Postgres).GetDB()

	ProxyDatabase := &PostgresProxyProvider{
		table: tableName,
		db:    database,
	}
	return ProxyDatabase
}

func (repo *PostgresProxyProvider) GetDB() *gorm.DB {
	return repo.db
}

func (repo *PostgresProxyProvider) Save(proxy model.Proxy) error {
	database := repo.db
	return database.Save(&proxy).Error
}
func (repo *PostgresProxyProvider) Count() (int64, error) {
	database := repo.db

	var count int64
	tx := database.Model(&model.Proxy{}).Count(&count)
	if tx.Error != nil {
		return 0, tx.Error
	}

	return count, nil
}

func (repo *PostgresProxyProvider) List(pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error) {
	database := repo.db
	results := make([]model.Proxy, 0)
	tx := database.Scopes(pagination.Paginate(&model.Proxy{}, pgn, database)).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Proxy]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresProxyProvider) FindByAccesslistID(id string, pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error) {
	database := repo.db
	results := make([]model.Proxy, 0)
	tx := database.Scopes(pagination.Paginate(&model.Proxy{}, pgn, database)).Where(&model.Proxy{AccessListID_FK: id}).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Proxy]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresProxyProvider) FindByAccesslistIDAndSearch(id string, pgn *pagination.Pagination[model.Proxy]) (*pagination.Pagination[model.Proxy], error) {
	database := repo.db
	results := make([]model.Proxy, 0)
	var tx *gorm.DB
	if len(strings.TrimSpace(pgn.Search)) != 0 {
		tx = database.Model(&model.Proxy{}).
			Where(&model.Proxy{AccessListID_FK: id}).
			Joins("INNER JOIN sources ON sources.proxy_id = proxies.proxy_id AND sources.host_name like ?", "%"+pgn.Search+"%").
			Scopes(
				pagination.Paginate(&model.Proxy{},
					pgn,
					database.Where(&model.Proxy{AccessListID_FK: id}).
						Joins("INNER JOIN sources ON sources.proxy_id = proxies.proxy_id AND sources.host_name like ?", "%"+pgn.Search+"%"))).Find(&results)
		// pgn.TotalRows
	} else {
		tx = database.Scopes(pagination.Paginate(&model.Proxy{}, pgn, database)).Where(&model.Proxy{AccessListID_FK: id}).Find(&results)
	}
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.Proxy]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresProxyProvider) FindByID(id string) (model.Proxy, error) {
	database := repo.db
	var result model.Proxy
	tx := database.Where(&model.Proxy{ProxyID: id}).First(&result)
	if tx.RowsAffected < 1 {
		return model.Proxy{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}

func (repo *PostgresProxyProvider) UpdateStatusByID(id string, status bool) error {
	database := repo.db

	tx := database.Where(&model.Proxy{ProxyID: id}).Update("status", status)
	return tx.Error
}

func (repo *PostgresProxyProvider) UpdateByID(id string, proxy model.Proxy) error {
	database := repo.db
	// uid, _ := uuid.FromBytes([]byte(proxy.ProxyID))
	tx := database.Save(&proxy)
	return tx.Error
}

func (repo *PostgresProxyProvider) Delete(id string) error {
	database := repo.db

	tx := database.Model(&model.Proxy{}).Delete(&model.Proxy{ProxyID: id})

	return tx.Error
}
