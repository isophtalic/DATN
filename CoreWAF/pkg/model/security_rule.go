package model

type RuleSet struct {
	RuleID       string `json:"rule_id" gorm:"type:uuid;primary_key"`
	ID           int    `json:"id" gorm:"type:int"`
	File         string `json:"file" gorm:"type:varchar(10);not null"`
	Content      string `json:"content" gorm:"type:text;not null"`
	Status       int    `json:"status" gorm:"type:int"`
	SecRuleID_FK string `json:"secrule_id,omitempty" gorm:"column:secrule_id;type:uuid;foreignKey:SecRuleID_FK;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

type SecurityRuleSet struct {
	SecRuleID  string `json:"secrule_id" gorm:"column:secrule_id;type:uuid;primary_key"`
	Name       string `json:"name" gorm:"type:varchar(50);not null"`
	ProxyID_FK string `json:"proxy_id,omitempty" gorm:"column:proxy_id;type:uuid;foreignKey:ProxyID_FK;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
