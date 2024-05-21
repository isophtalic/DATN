package datastorekafka

import (
	"context"
	"corewaf/configs"
	"fmt"
	"log"
)

type ctxKey string

const (
	ctxKeyToml      ctxKey = "toml"
	ctxKeyBrokers   ctxKey = "brokers"
	ctxKeyUser      ctxKey = "user"
	ctxKeyPassword  ctxKey = "password"
	ctxKeyPartition ctxKey = "partition"
)

func LoadKafkaVar(env configs.Configs, ctx context.Context) (context.Context, error) {
	ctxx := map[ctxKey]interface{}{
		ctxKeyToml: env,
		// ctxKeyBrokers:   env.Kafka_Brokers,
		// ctxKeyUser:      env.Kafka_User,
		// ctxKeyPassword:  env.Kafka_Password,
		// ctxKeyPartition: env.Kafka_Partition,
	}

	log.Println("kafka", "context", fmt.Sprintf("%+v", ctxx))
	for k, v := range ctxx {
		ctx = context.WithValue(ctx, k, v)
	}

	return ctx, nil
}

func ctxPartition(ctx context.Context) (int32, bool) {
	v, ok := ctx.Value(ctxKeyPartition).(int32)
	return v, ok
}

func ctxBrokers(ctx context.Context) ([]string, bool) {
	v, ok := ctx.Value(ctxKeyBrokers).([]string)
	if !ok || len(v) == 0 {
		return []string{}, false
	}
	return v, true
}

func ctxUser(ctx context.Context) (string, bool) {
	v, ok := ctx.Value(ctxKeyUser).(string)
	return v, ok
}

func ctxPassword(ctx context.Context) (string, bool) {
	v, ok := ctx.Value(ctxKeyPassword).(string)
	return v, ok
}
