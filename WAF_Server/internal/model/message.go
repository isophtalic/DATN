package model

import "time"

type MessageLog struct {
	ID        string    `json:"id"`
	Client    string    `json:"client"` // client IP
	Msg       string    `json:"msg"`    // log error
	CreatedAt time.Time `json:"createdAt"`
}
