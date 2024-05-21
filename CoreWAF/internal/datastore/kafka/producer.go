package datastorekafka

import (
	"context"
	"fmt"

	"github.com/IBM/sarama"
)

var partition int32
var prod sarama.SyncProducer

type ProducerKafka struct {
	producer sarama.SyncProducer
}

func NewSyncProducer(ctx context.Context) (*ProducerKafka, error) {
	brokers, ok := ctxBrokers(ctx)
	if !ok {
		return nil, fmt.Errorf("invalid brokers")
	}

	part, ok := ctxPartition(ctx)
	if !ok {
		return nil, fmt.Errorf("invalid partition")
	}

	partition = part

	config, err := NewConfig(ctx)

	if err != nil {
		return nil, err
	}

	prod, err := sarama.NewSyncProducer(brokers, config)
	if err != nil {
		return nil, err
	}

	return &ProducerKafka{
		producer: prod,
	}, nil
}

func CloseKafkaConnection() error {
	return prod.Close()
}

func (cmd *ProducerKafka) SendMessage(topic string, msg []byte) error {
	producer := cmd.producer

	m := &sarama.ProducerMessage{
		Partition: partition,
		Topic:     topic,
		Value:     sarama.ByteEncoder(msg),
	}

	_, _, err := producer.SendMessage(m)
	if err != nil {
		return err
	}

	return nil
}
