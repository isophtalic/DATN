package postgres

import (
	"fmt"
	"waf_server/internal/configs"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Postgres struct {
	db *gorm.DB
}

func NewPostgresQL(config *configs.Configs) *Postgres {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", config.DB_Host, config.DB_User, config.DB_Password, config.DB_Name, config.DB_Port)
	fmt.Println("Connecting DB . . .")
	fmt.Println(dsn)
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: dsn,
	}), &gorm.Config{
		Logger:                                   logger.Default.LogMode(logger.Silent),
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		panic("Connect postgres fail " + err.Error())
	}

	return &Postgres{
		db: db,
	}
}

func (pg *Postgres) GetDB() *gorm.DB {
	return pg.db
}
