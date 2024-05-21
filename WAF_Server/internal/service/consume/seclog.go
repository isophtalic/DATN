package service

import (
	"encoding/json"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/persistence"

	"github.com/IBM/sarama"
)

func DoProcessMsgSecLog(msg *sarama.ConsumerMessage) error {
	var res timescale_model.SecLog
	err := json.Unmarshal(msg.Value, &res)
	if err != nil {
		return err
	}

	err = persistence.TimescaleSeclog().Save(&res)
	if err != nil {
		return err
	}

	return nil
}
