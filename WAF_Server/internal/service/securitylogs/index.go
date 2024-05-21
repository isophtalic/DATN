package securitylogs_service

import (
	"encoding/json"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateSeclog(cmd timescale_model.SecLog) error {
	cmd.SecID = uuid.NewString()
	return persistence.TimescaleSeclog().Save(&cmd)
}

func ListPagination(c *gin.Context) (*pagination.Pagination[timescale_model.SecureLogsViewer], error) {
	pgn := pagination.NewPagination[timescale_model.SecLog](c)

	var result = []timescale_model.SecureLogsViewer{}
	pgn, err := persistence.TimescaleSeclog().List(pgn)
	if err != nil {
		return &pagination.Pagination[timescale_model.SecureLogsViewer]{}, err
	}

	logs := pgn.Records
	for _, v := range logs {
		arrSecLog := timescale_model.SecureLogsViewer{
			SecID:     v.SecID,
			CreatedAt: v.CreatedAt,
			ClientIP:  v.ClientIP,
			Host:      v.Host,
			Method:    v.Method,
			Proto:     v.Proto,
			URI:       v.URI,
			Headers:   v.Headers,
			Body:      v.Body,
			Form:      v.Form,
			Mess:      v.Mess,
			RuleID:    v.RuleID,
		}

		result = append(result, arrSecLog)
	}

	pgnResult := pagination.NewPagination[timescale_model.SecureLogsViewer](c)
	pgnResult.Records = result
	pgnResult.TotalPages = pgn.TotalPages
	pgnResult.TotalRows = pgn.TotalRows

	return pgnResult, nil
}

func DetailSeclog(id string) (timescale_model.ArraySecureLogs, error) {
	seclog, err := persistence.TimescaleSeclog().FindByID(id)
	if err != nil {
		return timescale_model.ArraySecureLogs{}, err
	}

	var temp []timescale_model.SecurityLog

	err = json.Unmarshal([]byte(seclog.SecureLogs), &temp)
	if err != nil {
		return timescale_model.ArraySecureLogs{}, err
	}

	result := timescale_model.ArraySecureLogs{
		SecID:      seclog.SecID,
		CreatedAt:  seclog.CreatedAt,
		ClientIP:   seclog.ClientIP,
		Host:       seclog.Host,
		Method:     seclog.Method,
		Proto:      seclog.Proto,
		URI:        seclog.URI,
		Headers:    seclog.Headers,
		Body:       seclog.Body,
		Form:       seclog.Form,
		Mess:       seclog.Mess,
		RuleID:     seclog.RuleID,
		SecureLogs: temp,
	}

	return result, nil
}
