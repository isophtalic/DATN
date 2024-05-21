package configs

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
	"waf_server/internal/model"

	"github.com/BurntSushi/toml"
)

var ConfigsVar *Configs
var ContainerVar *Container

type Configs struct {
	Port            string
	DB_User         string
	DB_Password     string
	DB_Host         string
	DB_Port         string
	DB_Name         string
	Kafka_Brockers  []string
	Kafka_Partition int32
}

type Container struct {
	*Configs
	JWT_Sercret *ecdsa.PrivateKey
	MemStore    *model.MemoryStore
	IPBlackist  *model.IPBlackist
}

func InitContainer(path string) (Container, error) {
	ConfigsVar = new(Configs)
	_, err := toml.DecodeFile(path, ConfigsVar)
	if err != nil {
		return Container{}, err
	}

	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fmt.Println("Error generating ECDSA private key:", err)
		return Container{}, err
	}

	// ip blackist can get in server or file blackist
	ContainerVar = &Container{
		Configs:     ConfigsVar,
		JWT_Sercret: privateKey,
		MemStore:    model.NewMemoryStore(),
		IPBlackist:  model.NewIPBlacklist(),
	}
	return *ContainerVar, err
}

func GetConfigVar() *Configs {
	return ConfigsVar
}

func GetContainerVar() *Container {
	return ContainerVar
}
