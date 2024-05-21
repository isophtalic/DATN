package datastorekafka

import (
	"context"

	"github.com/IBM/sarama"
)

func NewConfig(ctx context.Context) (*sarama.Config, error) {

	// username, ok := ctxUser(ctx)
	// if !ok {
	// 	return nil, fmt.Errorf("invalid username")
	// }

	// password, ok := ctxPassword(ctx)
	// if !ok {
	// 	return nil, fmt.Errorf("invalid password")
	// }

	config := sarama.NewConfig()
	config.Producer.Return.Successes = true
	// config.Net.SASL.Enable = true
	// config.Net.SASL.User = username
	// config.Net.SASL.Password = password
	// config.Net.SASL.Mechanism = sarama.SASLTypePlaintext

	return config, nil
}
