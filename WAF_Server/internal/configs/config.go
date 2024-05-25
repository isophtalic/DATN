package configs

import (
	"waf_server/internal/model"

	"github.com/BurntSushi/toml"
)

var ConfigsVar *Configs
var ContainerVar *Container

type Configs struct {
	Port           string
	DASHBOARD      string
	DB_User        string
	DB_Password    string
	DB_Host        string
	DB_Port        string
	DB_Name        string
	JWT_Sercret    string
	EMAIL_SENDER   string
	EMAIL_PASSWORD string
	SMTP_HOST      string
	SMTP_PORT      string
}

type Container struct {
	*Configs
	MemStore   *model.MemoryStore
	IPBlackist *model.IPBlackist
}

func InitContainer(path string) (Container, error) {
	ConfigsVar = new(Configs)
	_, err := toml.DecodeFile(path, ConfigsVar)
	if err != nil {
		return Container{}, err
	}

	// ip blackist can get in server or file blackist
	ContainerVar = &Container{
		Configs:    ConfigsVar,
		MemStore:   model.NewMemoryStore(),
		IPBlackist: model.NewIPBlacklist(),
	}
	return *ContainerVar, err
}

func GetConfigVar() *Configs {
	return ConfigsVar
}

func GetContainerVar() *Container {
	return ContainerVar
}
