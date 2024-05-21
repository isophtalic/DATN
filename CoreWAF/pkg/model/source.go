package model

import (
	"strconv"
	"time"
)

type Source struct {
	SourceID   string    `json:"source_id" gorm:"column:source_id;type:uuid;primary_key"`
	HostName   string    `json:"hostname" gorm:"type:varchar(50);not null"`
	Port       string    `json:"port" gorm:"type:varchar(6);not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
	ProxyID_FK string    `json:"proxy_id,omitempty" gorm:"column:proxy_id;type:uuid;foreignKey:ProxyID_FK;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

func (s *Source) Valid() bool {
	_, err := strconv.Atoi(s.Port)
	if err != nil {
		return false
	}

	if s.UpdatedAt.After(time.Now()) {
		return false
	}

	return true
}
