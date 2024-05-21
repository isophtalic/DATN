package main

import (
	"context"
	"corewaf/configs"
	waf_const "corewaf/internal/const"
	core_waf "corewaf/internal/waf/core"
	"corewaf/pkg/model"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/corazawaf/coraza/v3/types"
	"github.com/google/uuid"
)

var (
	logs       []string
	container  configs.Container
	err        error
	configPath string
)

func init() {
	flag.StringVar(&configPath, "config", "configs/config.toml", "location of the config file")
	flag.Parse()
	fmt.Println(configPath)
}

func main() {
	// container.IPBlackist.Push("127.0.0.1")
	container, err = configs.InitContainer(configPath)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.TODO()
	ctxx := map[waf_const.CtxKey]interface{}{
		waf_const.ServerKey: container.SERVER,
		waf_const.ApiKeyKey: container.APIKEY,
	}

	for k, v := range ctxx {
		ctx = context.WithValue(ctx, k, v)
	}

	// ctx, err = datastorekafka.LoadKafkaVar(*container.Configs, ctx)
	// if err != nil {
	// 	log.Println("somethings went wrong")
	// }

	core := core_waf.CreateWAF(logError)

	core.Start(container, ctx)

	// defer func() {
	// 	if err := datastorekafka.CloseKafkaConnection(); err != nil {
	// 		log.Panicf("can't close kafka connection with error: %s", err.Error())
	// 	}

	// 	if r := recover(); r != nil {
	// 		fmt.Println("recovered from:", r)
	// 	}
	// }()
}

func logError(error types.MatchedRule) {
	signalQueue := model.MessageLog{
		ID:        uuid.NewString(),
		Client:    error.ClientIPAddress(),
		Rules:     error.Rule(),
		Message:   error.Message(),
		Data:      error.Data(),
		CreatedAt: time.Now(),
	}

	if err := container.MemStore.Push(signalQueue); err != nil {
		fmt.Println(err)
	}

	fmt.Println()
	fmt.Println(error.AuditLog())
}
