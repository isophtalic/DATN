package persistence

import (
	"log"
	"os"
	"sync"
	"waf_server/internal/configs"
	"waf_server/internal/model"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/persistence/database"
	"waf_server/internal/persistence/postgres"
	"waf_server/internal/repository"
)

var (
	postgresDB         *postgres.Postgres
	proxy              repository.ProxyRepository
	source             repository.SourceRepository
	ruleset            repository.RuleSetrepository
	data               repository.DataRepository
	secruleset         repository.SecurityRuleSetRepository
	accesslist         repository.AccessListRepository
	blacklist          repository.BlacklistReposiory
	destination        repository.DestinationRepository
	user               repository.UserRepository
	sec_logs           repository.TimescaleSeclog
	actions            repository.ActionsReposiory
	loadRepositoryOnce sync.Once
)

func loadRepositoryProvider() {
	loadRepositoryOnce.Do(func() {
		proxy = database.NewPostgresProxyProvider("proxy", postgresDB)
		source = database.NewPostgresSourceProvider(postgresDB)
		ruleset = database.NewPostgresRuleSetProvider("rule_set", postgresDB)
		data = database.NewPostgresDataProvider("data", postgresDB)
		secruleset = database.NewPostgresSecRuleSetProvider("sec_rule_set", postgresDB)
		accesslist = database.NewPostgresAccessListProvider("access_list", postgresDB)
		blacklist = database.NewPostgresBlackListProvider("blacklist", postgresDB)
		destination = database.NewPostgresDestinationProvider("destination", postgresDB)
		user = database.NewPostgresUserProvider("user", postgresDB)
		actions = database.NewPostgresActionsProvider("actions", postgresDB)
		sec_logs = database.NewTimescaleSeclogProvider("sec_logs", postgresDB)
	})
}

func ConnectDatabase(config configs.Configs) {
	postgresDB = postgres.NewPostgresQL(&config)
	loadRepositoryProvider()
}

func MigrateDatabase() {
	defer func() {
		if err := recover(); err != nil {
			panic(err)
		}
	}()

	err := postgresDB.GetDB().AutoMigrate(
		&model.Proxy{},
		&model.Source{},
		&model.AccessList{},
		&model.Destination{},
		&model.RuleSet{},
		&model.SecurityRuleSet{},
		&model.User{},
		&model.Blacklist{},
		&model.Actions{},
		&model.Data{},
	)
	if err != nil {
		panic(err)
	}

	// err = migrateTimescaleTable()
	// if err != nil {
	// 	panic(err)
	// }

}

// TODO: fix open file
func migrateTimescaleTable() error {
	err := postgresDB.GetDB().AutoMigrate(
		&timescale_model.SecLog{},
	)

	if err != nil {
		return nil
	}

	query, err := os.ReadFile("/internal/persistence/postgres/migrations/seclog.sql")
	if err != nil {
		return err
	}

	tx := postgresDB.GetDB().Exec(string(query))
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func Proxy() repository.ProxyRepository {
	if proxy == nil {
		log.Fatalln("implement proxy error")
	}

	return proxy
}

func Source() repository.SourceRepository {
	if source == nil {
		log.Fatalln("implement source error")
	}

	return source
}

func RuleSet() repository.RuleSetrepository {
	if ruleset == nil {
		log.Fatalln("implement rule error")
	}

	return ruleset
}

func SecRuleSet() repository.SecurityRuleSetRepository {
	if secruleset == nil {
		log.Fatalln("implement secrule error")
	}

	return secruleset
}

func Accesslist() repository.AccessListRepository {
	if accesslist == nil {
		log.Fatalln("implement accesslist error")
	}

	return accesslist
}

func Blacklist() repository.BlacklistReposiory {
	if blacklist == nil {
		log.Fatalln("implement blacklist error")
	}

	return blacklist
}

func Destination() repository.DestinationRepository {
	if destination == nil {
		log.Fatalln("implement destination error")
	}

	return destination
}

func User() repository.UserRepository {
	if user == nil {
		log.Fatalln("implement user error")
	}

	return user
}

func TimescaleSeclog() repository.TimescaleSeclog {
	if sec_logs == nil {
		log.Fatalln("implement sec_logs error")
	}

	return sec_logs
}

func Actions() repository.ActionsReposiory {
	if actions == nil {
		log.Fatalln("implement actions error")
	}

	return actions
}

func Data() repository.DataRepository {
	if data == nil {
		log.Fatalln("implement data rule error")
	}

	return data
}
