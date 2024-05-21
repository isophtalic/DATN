package timescale_model

import "time"

type SecLog struct {
	SecID      string    `json:"sec_id" gorm:"type:uuid;not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"type:timestamptz;unique;not null"`
	ClientIP   string    `json:"client_ip" gorm:"type:TEXT;not null"`
	Host       string    `json:"host" gorm:"type:TEXT;not null"`
	Method     string    `json:"method" gorm:"type:TEXT;not null"`
	Proto      string    `json:"proto" gorm:"type:TEXT;not null"`
	URI        string    `json:"uri" gorm:"type:TEXT;not null"`
	Headers    string    `json:"headers" gorm:"type:text;not null"`
	Body       string    `json:"body" gorm:"type:text;not null"`
	Form       string    `json:"form" gorm:"type:text"`
	Mess       string    `json:"mess" gorm:"type:TEXT;not null"`
	RuleID     int       `json:"rule_id" gorm:"type:integer;not null"`
	SecureLogs string    `json:"secure_logs" gorm:"type:text;not null"`
}

type SecurityLog struct {
	RuleEngine bool   `json:"rule_engine" gorm:"column:rule_engine;type:bool;not null"`
	Filename   string `json:"filename" gorm:"type:TEXT;not null"`
	Line       int    `json:"line" gorm:"type:integer;not null"`
	ID         int    `json:"id" gorm:"type:integer;not null"`
	Rev        string `json:"rev" gorm:"type:TEXT;not null"`
	Msg        string `json:"msg" gorm:"type:TEXT;not null"`
	Data       string `json:"data" gorm:"type:TEXT;not null"`
	Severity   int    `json:"severity" gorm:"type:integer;not null"`
	Ver        string `json:"ver" gorm:"type:TEXT;not null"`
	Maturity   int    `json:"maturity" gorm:"type:integer;not null"`
	Accuracy   int    `json:"accuracy" gorm:"type:integer;not null"`
	Tags       string `json:"tags" gorm:"type:text;not null"`
	Raw        string `json:"raw" gorm:"type:TEXT;not null"`
}

type ArraySecureLogs struct {
	SecID      string        `json:"sec_id" gorm:"type:uuid;not null"`
	CreatedAt  time.Time     `json:"created_at" gorm:"type:timestamptz;not null"`
	ClientIP   string        `json:"client_ip" gorm:"type:TEXT;not null"`
	Host       string        `json:"host" gorm:"type:TEXT;not null"`
	Method     string        `json:"method" gorm:"type:TEXT;not null"`
	Proto      string        `json:"proto" gorm:"type:TEXT;not null"`
	URI        string        `json:"uri" gorm:"type:TEXT;not null"`
	Headers    string        `json:"headers" gorm:"type:TEXT;not null"`
	Body       string        `json:"body" gorm:"type:text;not null"`
	Form       string        `json:"form" gorm:"type:TEXT"`
	Mess       string        `json:"mess" gorm:"type:TEXT;not null"`
	RuleID     int           `json:"rule_id" gorm:"type:integer;not null"`
	SecureLogs []SecurityLog `json:"secure_logs"`
}

type SecureLogsViewer struct {
	SecID     string    `json:"sec_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamptz;not null"`
	ClientIP  string    `json:"client_ip" gorm:"type:TEXT;not null"`
	Host      string    `json:"host" gorm:"type:TEXT;not null"`
	Method    string    `json:"method" gorm:"type:TEXT;not null"`
	Proto     string    `json:"proto" gorm:"type:TEXT;not null"`
	URI       string    `json:"uri" gorm:"type:TEXT;not null"`
	Headers   string    `json:"headers" gorm:"type:TEXT;not null"`
	Body      string    `json:"body" gorm:"type:text;not null"`
	Form      string    `json:"form" gorm:"type:TEXT"`
	Mess      string    `json:"mess" gorm:"type:TEXT;not null"`
	RuleID    int       `json:"rule_id" gorm:"type:integer;not null"`
}
