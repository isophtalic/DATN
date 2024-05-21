package datastore

import model "corewaf/pkg/model/auditlog"

type RequestRepository interface {
	SendRequest(msg model.RequestLog) error
}
