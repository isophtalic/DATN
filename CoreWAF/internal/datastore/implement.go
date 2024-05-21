package datastore

import (
	"context"
	datastorekafka "corewaf/internal/datastore/kafka"
	"log"
	"sync"
)

var (
	request       RequestRepository
	request_error RequestErrorRepository
	load          sync.Once
)

func loadProvider(ctx context.Context) {
	load.Do(func() {
		request = datastorekafka.NewRequestProvider(ctx)
		request_error = datastorekafka.NewRequestErrorProvider(ctx)
	})
}

func PrepareProducerKafka(ctx context.Context) {
	loadProvider(ctx)
}

func Request() RequestRepository {
	if request == nil {
		log.Panic("invalid request kafka")
	}

	return request
}

func Request_Error() RequestErrorRepository {
	if request_error == nil {
		log.Panic("invalid request kafka")
	}

	return request_error
}
