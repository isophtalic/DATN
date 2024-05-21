package configs

import (
	"corewaf/pkg/lumberjackrus"
	"corewaf/pkg/model"
	"corewaf/pkg/utils"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/sirupsen/logrus"
)

type Provider struct {
	*utils.LoggerProvider
}

type Configs struct {
	LogLevel int
	LogDir   string
	Port     string
	Target   string
	APIKEY   string
	SERVER   string
	// Kafka_Brokers   []string
	// Kafka_User      string
	// Kafka_Password  string
	// Kafka_Partition int32
}

type Container struct {
	*Provider
	*Configs
	MemStore   *model.MemoryStore
	IPBlackist *model.IPBlackist
}

func InitContainer(path string) (Container, error) {
	var configs = new(Configs)
	_, err := toml.DecodeFile(path, configs)
	if err != nil {
		return Container{}, err
	}

	// fmt.Println(configs.Kafka_Brokers)

	// if len(configs.Kafka_Brokers) == 0 {
	// 	return Container{}, fmt.Errorf("invalid brokers")
	// }

	// ip blackist can get in server or file blackist

	container := Container{
		Configs:    configs,
		MemStore:   model.NewMemoryStore(),
		IPBlackist: model.NewIPBlacklist(),
	}
	// container.LoadProvider()
	return container, err
}

func (container Container) LoadProvider() {
	config := container.Configs

	container.Provider = &Provider{
		LoggerProvider: utils.NewLoggerProvider(container.LogLevel),
	}

	hook, err := lumberjackrus.NewHook(
		&lumberjackrus.LogFile{
			Filename:   path.Join(config.LogDir, "general.log"),
			MaxSize:    10,
			MaxBackups: 2,
			MaxAge:     1,
			Compress:   false,
			LocalTime:  false,
		},
		logrus.InfoLevel,
		&logrus.TextFormatter{
			FullTimestamp: true,
		},
		&lumberjackrus.LogFileOpts{
			logrus.InfoLevel: &lumberjackrus.LogFile{
				Filename:   path.Join(config.LogDir, "info.log"),
				MaxSize:    10,
				MaxBackups: 2,
				MaxAge:     1,
				Compress:   false,
				LocalTime:  false,
			},
			logrus.ErrorLevel: &lumberjackrus.LogFile{
				Filename:   path.Join(config.LogDir, "error.log"),
				MaxSize:    10,
				MaxBackups: 2,
				MaxAge:     1,
				Compress:   false,
				LocalTime:  false,
			},
		},
	)
	if err != nil {
		panic(err)
	}

	container.LoggerProvider.Logger().AddHook(hook)
}
