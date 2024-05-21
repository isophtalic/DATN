package datastore

import model "corewaf/pkg/model/auditlog"

type RequestErrorRepository interface {
	SendRequest(msg model.SecurityLog) error
}
