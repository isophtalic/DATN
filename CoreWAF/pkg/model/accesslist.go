package model

import (
	"time"

	"github.com/lib/pq"
)

type AccessList struct {
	AccessListID string         `json:"blacklist_id" gorm:"type:uuid;primary_key"`
	Blacklist    pq.StringArray `json:"blacklist" gorm:"type:text[]; not null"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"type:timestamp;not null"`
	ProxyID_FK   string         `json:"proxy_id,omitempty" gorm:"column:proxy_id;type:uuid;foreignKey:ProxyID_FK;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

func (a *AccessList) Valid() bool {
	return !a.UpdatedAt.After(time.Now())
}
