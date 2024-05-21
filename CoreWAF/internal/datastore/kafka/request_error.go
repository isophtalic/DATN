package datastorekafka

import (
	"context"
	model "corewaf/pkg/model/auditlog"
	"encoding/json"
	"log"
)

const RequestErrorTopic = "request_error"

type RequestErrorProvider struct {
	producer ProducerKafka
}

func NewRequestErrorProvider(ctx context.Context) *RequestErrorProvider {
	syncProducer, err := NewSyncProducer(ctx)
	if err != nil {
		log.Panic(err)
	}
	return &RequestErrorProvider{
		producer: *syncProducer,
	}
}

func (cmd *RequestErrorProvider) SendRequest(msg model.SecurityLog) error {
	m, err := json.Marshal(&msg)
	if err != nil {
		return err
	}

	return cmd.producer.SendMessage(RequestErrorTopic, m)
}
