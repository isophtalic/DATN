package main

import (
	"log"
	"os"
	"os/signal"
	"waf_server/internal/persistence/kafka"
	serviceConsumer "waf_server/internal/service/consume"

	"github.com/IBM/sarama"
)

func KafkaServer() {
	consumerConfig := sarama.NewConfig()
	master := kafka.NewKafkaConsumer(container.Configs, consumerConfig)

	consumerTopicSec, err := master.NewKafkaConsumerPartitionWithTopic(requestErrorTopic)
	if err != nil {
		panic(err)
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)
	doneCh := make(chan struct{})

	go catchReqSecTopic(consumerTopicSec, signals, doneCh)

	<-doneCh

}

func catchReqSecTopic(consumerTopicSec sarama.PartitionConsumer, signals chan os.Signal, doneCh chan struct{}) {
	for {
		select {
		case err := <-consumerTopicSec.Errors():
			log.Println(err)
		case msg := <-consumerTopicSec.Messages():
			err := serviceConsumer.DoProcessMsgSecLog(msg)
			if err != nil {
				log.Println(err)
			}
		case <-signals:
			log.Println("Interrupt is detected")
			doneCh <- struct{}{}
		}
	}
}
