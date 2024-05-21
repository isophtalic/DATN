package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"waf_server/internal/configs"
	"waf_server/internal/persistence"
	"waf_server/internal/router"
)

var (
	container  configs.Container
	err        error
	configPath string
)

func init() {
	flag.StringVar(&configPath, "config", "configure.toml", "location of the config file")
	flag.Parse()
	fmt.Println(configPath)
}

func main() {
	container, err = configs.InitContainer(configPath)
	if err != nil {
		log.Fatal(err)
	}

	persistence.ConnectDatabase(*container.Configs)

	args := os.Args
	if len(args) != 2 {
		panic("missing some argument")
	}

	switch args[1] {
	case "kafka":
		KafkaServer()
	case "serve":
		Server()
	case "setup":
		InitalUser()
	case "migrate":
		persistence.MigrateDatabase()
	default:
		fmt.Println("Hello, have a good day !")
	}

}

var (
	requestErrorTopic = "request_error"
)

func Server() {
	server := router.NewApiV1(container)
	server.Run(":8123")
}

// TODO: SSL cert
