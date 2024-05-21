package model

import (
	"mime/multipart"
	"net/url"
	"time"
)

type AuditLog struct {
	AuditLogID  string
	PartsID     string
	Transaction AuditLogTransaction
	Message     Message
}

type RequestLog struct {
	ID          string
	TimeRequest time.Time
	ClientIP    string
	Host        string
	Method      string
	Proto       string
	URI         string
	Target      string
	Headers     map[string][]string
	Body        string
	Form        RequestForm
	CreatedAt   time.Time
}

type RequestForm struct {
	FormValue url.Values
	FormFile  *multipart.Form
}

type AuditLogTransaction struct {
	TransactionID       string
	Timestamp           string
	ID                  string
	ClientIP            string
	ClientPort          int
	HostIP              string
	HostPort            int
	ServerID            string
	RequestTransaction  RequestTransaction
	ResponseTransaction ResponseTransaction
	ProducerTransaction ProducerTransaction
}

type RequestTransaction struct {
	RequestTransactionID    string
	Method                  string
	Protocol                string
	URI                     string
	HTTPVersion             string
	Headers                 map[string]interface{}
	Body                    string
	RequestFileTransactions []RequestFileTransaction
}

type ResponseTransaction struct {
	ResponseTransactionID string
	Protocol              string
	Status                string
	Headers               map[string]interface{}
	Body                  string
}

type ProducerTransaction struct {
	ProducerTransactionID string
	Connector             string
	Version               string
	Server                string
	RuleEngine            string
	Stopwatch             string
	Rulesets              []string
}

type RequestFileTransaction struct {
	RequestFileTransactionID string
	Name                     string
	Size                     int
	Mine                     string
}

type Message struct {
	MessageID   string
	Message     string
	MessageData MessageData
}

type MessageData struct {
	File     string
	Line     int
	ID       int
	Rev      string
	Data     string
	Severity string
	Ver      string
	Maturity int
	Accuracy int
	Tags     []string
	Raw      string
}
