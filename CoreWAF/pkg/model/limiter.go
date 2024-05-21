package model

import (
	"time"

	"golang.org/x/time/rate"
)

type ClientLimiter struct {
	Limiter  *rate.Limiter
	LastSeen time.Time
}

func NewClientLimiter() *ClientLimiter {
	return &ClientLimiter{
		Limiter:  rate.NewLimiter(2, 4),
		LastSeen: time.Time{},
	}
}
