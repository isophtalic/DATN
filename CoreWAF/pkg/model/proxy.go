package model

type Proxy struct {
	ProxyID string `json:"proxy_id" gorm:"column:proxy_id;type:uuid;primary_key;not null"`
	Status  bool   `json:"status" gorm:"type:bool;not null"`
}
