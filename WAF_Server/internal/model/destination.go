package model

import (
	"net"
	"strings"
	"time"
)

type Destination struct {
	DestinationID string    `json:"destination_id" gorm:"column:destination_id;type:uuid;primary_key"`
	Scheme        string    `json:"scheme" gorm:"type:varchar(6);not null"`
	IP            string    `json:"ip" gorm:"type:varchar(20);not null"`
	ForwardPort   string    `json:"forward_port" gorm:"type:varchar(6);not null"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"type:timestamptz;not null"`
	SourceID_FK   string    `json:"source_id,omitempty" gorm:"column:source_id;type:uuid;foreignKey:source_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

func (d *Destination) Valid() bool {
	if len(strings.TrimSpace(d.SourceID_FK)) == 0 {
		return false
	}

	if d.Scheme != "http" && d.Scheme != "https" {
		return false
	}

	ip := net.ParseIP(d.IP)
	if ip == nil {
		return false
	}

	if ipv4 := ip.To4(); ipv4 == nil {
		return false
	}

	if d.UpdatedAt.After(time.Now()) {
		return false
	}

	return true
}
