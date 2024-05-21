package model

import "time"

type Proxy struct {
	ProxyID         string    `json:"proxy_id" gorm:"column:proxy_id;type:uuid;primary_key;not null"`
	Status          bool      `json:"status" gorm:"type:bool;not null"`
	Cache           bool      `json:"cache" gorm:"type:bool;not null"`
	CreatedAt       time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt       time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
	AccessListID_FK string    `json:"accesslist_id,omitempty" gorm:"column:accesslist_id;type:uuid;foreignKey:proxy_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	SecRuleID_FK    string    `json:"secrule_id,omitempty" gorm:"column:secrule_id;type:uuid;foreignKey:secrule_id;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

type ProxyViewer struct {
	Proxy
	Hostname    string `json:"hostname"`
	Port        string `json:"port"`
	Scheme      string `json:"scheme"`
	Ip          string `json:"ip"`
	ForwardPort string `json:"forward_port"`
	Rule        string `json:"rule"`
}

type ProxyViewerDetail struct {
	Proxy
	Source      Source          `json:"source"`
	Destination Destination     `json:"destination"`
	SecRule     SecurityRuleSet `json:"secrule"`
	Acesslist   AccessList      `json:"accesslist"`
}
