package model

import (
	"mime/multipart"
	"net/url"
	"time"
)

type SecurityLog struct {
	ID            string
	CreatedAt     time.Time
	ClientIP      string
	Host          string
	Method        string
	Proto         string
	URI           string
	Target        string
	Headers       map[string][]string
	Body          string
	Form          RequestForm
	RuleEngine    bool
	Message       Message
	ResquestLogID string
}

type RequestForm struct {
	FormValue url.Values
	FormFile  *multipart.Form
}

type Message struct {
	MessageID   string
	Actionset   string
	Message     string
	MessageData MessageData
}

type MessageData struct {
	File     string
	Line     int
	ID       int
	Rev      string
	Msg      string
	Data     string
	Severity int
	Ver      string
	Maturity int
	Accuracy int
	Tags     []string
	Raw      string
}
