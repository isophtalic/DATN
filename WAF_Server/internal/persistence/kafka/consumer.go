package kafka

import (
	"log"
	"waf_server/internal/configs"

	"github.com/IBM/sarama"
)

type KafkaConsumer struct {
	consumnerMaster sarama.Consumer
	partition       int32
}

func NewKafkaConsumer(config *configs.Configs, configKafka *sarama.Config) *KafkaConsumer {
	cs, err := sarama.NewConsumer(config.Kafka_Brockers, configKafka)
	if err != nil {
		log.Panic(err)
	}
	return &KafkaConsumer{
		consumnerMaster: cs,
		partition:       config.Kafka_Partition,
	}
}

func (cmd *KafkaConsumer) NewKafkaConsumerPartitionWithTopic(topic string) (sarama.PartitionConsumer, error) {
	consumerPart, err := cmd.consumnerMaster.ConsumePartition(topic, cmd.partition, sarama.OffsetOldest)
	if err != nil {
		return nil, err
	}

	return consumerPart, nil
}
