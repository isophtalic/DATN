package database

import (
	"fmt"
	"strconv"
	"strings"
	"time"
	"waf_server/internal/model"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/pkg/pagination"

	"gorm.io/gorm"
)

type TimescaleSeclogProvider struct {
	table string
	db    *gorm.DB
}

func NewTimescaleSeclogProvider(tablename string, db interface{}) *TimescaleSeclogProvider {
	database := db.(*postgres.Postgres).GetDB()
	repo := &TimescaleSeclogProvider{
		table: tablename,
		db:    database,
	}

	return repo
}

func (repo *TimescaleSeclogProvider) Save(cmd *timescale_model.SecLog) error {
	database := repo.db
	return database.Model(&timescale_model.SecLog{}).Create(&cmd).Error
}

func (repo *TimescaleSeclogProvider) List(pgn *pagination.Pagination[timescale_model.SecLog]) (*pagination.Pagination[timescale_model.SecLog], error) {
	db := repo.db
	results := make([]timescale_model.SecLog, 0)

	tx := db.Scopes(pagination.Paginate(&timescale_model.SecLog{}, pgn, db)).Find(&results)
	pgn.Records = results

	if tx.Error != nil {
		return &pagination.Pagination[timescale_model.SecLog]{}, tx.Error
	}

	return pgn, nil
}

func (repo *TimescaleSeclogProvider) OverviewSecLog(field string, timerange string, limit int) ([]model.EventCount, error) {
	db := repo.db
	tr := strings.Split(timerange, " ")
	if len(tr) > 2 {
		return nil, fmt.Errorf("invalid time range")
	}

	var result = make([]model.EventCount, 0)
	switch tr[1] {
	case "days", "day":
		day, err := strconv.Atoi(tr[0])
		if err != nil {
			return nil, err
		}

		tx := db.Model(&timescale_model.SecLog{}).
			Select(fmt.Sprintf("%s as field, COUNT(*) as count", field)).
			Where("created_at >= ?", time.Now().AddDate(0, 0, -day)).
			Group(field).
			Order("count DESC").
			Scan(&result)

		if tx.Error != nil {
			return nil, err
		}

		return result, nil
	case "months", "month":
		month, err := strconv.Atoi(tr[0])
		if err != nil {
			return nil, err
		}

		tx := db.Model(&timescale_model.SecLog{}).Select(fmt.Sprintf("%s as field, COUNT(*) as count", field)).Where("created_at >= ?", time.Now().AddDate(0, -month, 0)).Group(field).Order("count DESC").Scan(&result)
		if tx.Error != nil {
			return nil, err
		}

		return result, nil
	case "years", "year":
		year, err := strconv.Atoi(tr[0])
		if err != nil {
			return nil, err
		}

		tx := db.Model(&timescale_model.SecLog{}).Select(fmt.Sprintf("%s as field, COUNT(*) as count", field)).Where("created_at >= ?", time.Now().AddDate(-year, 0, 0)).Group(field).Order("count DESC").Scan(&result)
		if tx.Error != nil {
			return nil, err
		}

		return result, nil
	default:
		return nil, fmt.Errorf("invalid time range")
	}
}

func (repo *TimescaleSeclogProvider) Count() (int64, error) {
	db := repo.db

	var result int64
	tx := db.Model(&timescale_model.SecLog{}).Count(&result)
	if tx.Error != nil {
		return 0, tx.Error
	}

	return result, nil
}

func (repo *TimescaleSeclogProvider) FindByID(id string) (timescale_model.SecLog, error) {
	database := repo.db
	var result timescale_model.SecLog
	tx := database.Where(&timescale_model.SecLog{SecID: id}).First(&result)
	if tx.RowsAffected < 1 {
		return timescale_model.SecLog{}, gorm.ErrRecordNotFound
	}
	return result, tx.Error
}
