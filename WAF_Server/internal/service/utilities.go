package service

import (
	"encoding/json"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"

	"github.com/google/uuid"
)

func CreateActions(src any, dest any, id string, target, actor string, action string) error {
	destByteArr, _ := json.Marshal(dest)
	srcByteArr, _ := json.Marshal(src)

	newAction := model.Actions{
		ID:          uuid.NewString(),
		CreatedAt:   time.Now(),
		Name:        action,
		Target:      target,
		TargetID:    id,
		InitiatedBy: actor,
		Original:    string(srcByteArr),
		Changes:     string(destByteArr),
	}

	return persistence.Actions().Save(newAction)
}
