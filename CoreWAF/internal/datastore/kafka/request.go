package datastorekafka

import (
	"context"
	model "corewaf/pkg/model/auditlog"
	"encoding/json"
	"log"
)

const RequestTopic = "request"

type RequestProvider struct {
	producer ProducerKafka
}

func NewRequestProvider(ctx context.Context) *RequestProvider {
	syncProducer, err := NewSyncProducer(ctx)
	if err != nil {
		log.Panic(err)
	}
	return &RequestProvider{
		producer: *syncProducer,
	}
}

func (cmd *RequestProvider) SendRequest(msg model.RequestLog) error {
	m, err := json.Marshal(&msg)
	if err != nil {
		return err
	}

	return cmd.producer.SendMessage(RequestTopic, m)
}
