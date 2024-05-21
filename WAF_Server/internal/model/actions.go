package model

import "time"

const (
	ACTION_CREATE = "create"
	ACTION_UPDATE = "update"
	ACTION_DELETE = "delete"
)

type Actions struct {
	ID          string    `json:"id" gorm:"column:id;type:uuid;primary_key;not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	Name        string    `json:"name" gorm:"column:name;type:varchar(6);not null"`
	InitiatedBy string    `json:"initiated_by" gorm:"type:varchar(20);not null"`
	Target      string    `json:"target" gorm:"type:varchar(20);not null"`
	TargetID    string    `json:"target_id" gorm:"type:uuid;not null"`
	Changes     string    `json:"changes" gorm:"type:text;not null"`
	Original    string    `json:"original" gorm:"type:text;not null"`
}
