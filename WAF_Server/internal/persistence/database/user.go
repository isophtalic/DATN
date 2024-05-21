package database

import (
	"waf_server/internal/model"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

var SELECT_FIELD_USER = []string{"id", "username", "email", "role", "status", "created_at", "updated_at"}

type PostgresUserProvider struct {
	table string
	db    *gorm.DB
}

func NewPostgresUserProvider(tableName string, db interface{}) *PostgresUserProvider {
	database := db.(*postgres.Postgres).GetDB()
	UserDatabase := &PostgresUserProvider{
		table: tableName,
		db:    database,
	}

	return UserDatabase
}

func (repo *PostgresUserProvider) GetDB() *gorm.DB {
	database := repo.db
	return database
}

func (repo *PostgresUserProvider) Save(user *model.User) error {
	database := repo.db
	return database.Save(&user).Error
}

func (repo *PostgresUserProvider) FindUserByUsername(username string) (model.User, error) {
	database := repo.db
	var result model.User
	tx := database.Where(&model.User{Username: username}).First(&result)
	if tx.Error != nil {
		return model.User{}, tx.Error
	}

	return result, nil
}

func (repo *PostgresUserProvider) FindUserByID(id string) (model.User, error) {
	database := repo.db
	var result model.User
	tx := database.Where(&model.User{ID: id}).First(&result)
	if tx.Error != nil {
		return model.User{}, tx.Error
	}

	return result, nil
}

func (repo *PostgresUserProvider) FindUserByEmail(email string) (model.User, error) {
	database := repo.db
	var result model.User
	tx := database.Where(&model.User{Email: email}).First(&result)
	if tx.Error != nil {
		return model.User{}, tx.Error
	}

	return result, nil
}

func (repo *PostgresUserProvider) ListUser(pgn *pagination.Pagination[model.UserResponse]) (*pagination.Pagination[model.UserResponse], error) {
	database := repo.db
	results := make([]model.UserResponse, 0)
	tx := database.Model(&model.User{}).Scopes(pagination.Paginate(&model.User{}, pgn, database)).Select(SELECT_FIELD_USER).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[model.UserResponse]{}, tx.Error
	}

	return pgn, nil
}

func (repo *PostgresUserProvider) UpdateByID(id string, cmd model.User) error {
	database := repo.db
	tx := database.Model(&model.User{}).Where(&model.User{ID: id}).Updates(cmd)
	return tx.Error
}

func (repo *PostgresUserProvider) DeleteByID(id string) error {
	database := repo.db
	tx := database.Model(&model.User{}).Delete(id)

	return tx.Error
}
