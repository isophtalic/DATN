package model

import (
	"time"
)

const (
	STATUS_ALLOW = iota
	STATUS_DENY
)

type Blacklist struct {
	ID              string `json:"id" gorm:"type:uuid;primary_key;not null"`
	IP              string `json:"ip" gorm:"type:varchar(20);not null"`
	Status          int    `json:"status" gorm:"type:integer; not null"`
	AccessListID_FK string `json:"accesslist_id,omitempty" gorm:"column:accesslist_id;type:uuid;foreignKey:proxy_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

type AccessList struct {
	AccessListID string    `json:"accesslist_id" gorm:"type:uuid;primary_key"`
	Name         string    `json:"name" gorm:"type:varchar(20);not null"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
}

func (a *AccessList) Valid() bool {
	return !a.UpdatedAt.After(time.Now())
}
