package model

import (
	"fmt"
	"time"
)

type Data struct {
	DataID       string    `json:"data_id" gorm:"type:uuid;primary_key"`
	Name         string    `json:"name" gorm:"type:varchar(30);unique;not null"`
	SecRuleID_FK string    `json:"secrule_id,omitempty" gorm:"column:secrule_id;type:uuid;foreignKey:secrule_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	CreatedAt    time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
	Content      string    `json:"content" gorm:"type:text;not null"`
	Description  string    `json:"description" gorm:"type:text;not null"`
}

type RuleSet struct {
	RuleID       string    `json:"rule_id" gorm:"type:uuid;primary_key"`
	ID           int       `json:"id" gorm:"type:integer"`
	File         string    `json:"file" gorm:"type:varchar(10);not null"`
	Content      string    `json:"content" gorm:"type:text;not null"`
	Status       int       `json:"status" gorm:"type:integer"`
	CreatedAt    time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
	SecRuleID_FK string    `json:"secrule_id,omitempty" gorm:"column:secrule_id;type:uuid;foreignKey:secrule_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

type SecurityRuleSet struct {
	SecRuleID     string    `json:"secrule_id" gorm:"column:secrule_id;type:uuid;primary_key"`
	Name          string    `json:"name" gorm:"type:varchar(50);unique;not null"`
	DebugLoglevel int       `json:"debug_log_level" gorm:"type:integer;not null"`
	CreatedAt     time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
}

func (cmd *SecurityRuleSet) Valid() error {
	if len(cmd.Name) <= 0 || len(cmd.Name) >= 255 {
		return fmt.Errorf("invalid rule name")
	}
	return nil
}
