package model

import (
	"time"

	"github.com/corazawaf/coraza/v3/types"
)

type MessageLog struct {
	ID        string             `json:"id"`
	Client    string             `json:"client"` // client IP
	Rules     types.RuleMetadata `json:"rules"`  // log error
	CreatedAt time.Time          `json:"createdAt"`
	Message   string             `json:"message"`
	Data      string             `json:"data"`
}
