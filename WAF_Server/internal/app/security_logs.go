package app

import (
	"encoding/json"
	"log"
	"time"
	"waf_server/internal/configs"
	timescale_model "waf_server/internal/model/timescale"
	mail_service "waf_server/internal/service/mail"
	securitylogs_service "waf_server/internal/service/securitylogs"

	"github.com/gin-gonic/gin"
)

func CreateSeclog(c *gin.Context) {
	var cmd timescale_model.ArraySecureLogs

	if err := c.ShouldBindJSON(&cmd); err != nil {
		ResponseError(c, err)
		return
	}

	config := configs.GetConfigVar()

	arrByteSeclogs, err := json.Marshal(cmd.SecureLogs)
	if err != nil {
		ResponseError(c, err)
		return
	}

	seclogs := timescale_model.SecLog{
		CreatedAt:  time.Now(),
		ClientIP:   cmd.ClientIP,
		Host:       cmd.Host,
		Method:     cmd.Method,
		Proto:      cmd.Proto,
		URI:        cmd.URI,
		Headers:    cmd.Headers,
		Body:       cmd.Body,
		Form:       cmd.Form,
		Mess:       cmd.Mess,
		RuleID:     cmd.RuleID,
		SecureLogs: string(arrByteSeclogs),
	}

	if cmd.SecureLogs[0].Severity <= 2 {
		mailSevice := mail_service.NewMailService(config)
		go func() {
			err := mailSevice.NotifyToAdmin(seclogs)
			if err != nil {
				log.Println(err)
			}
		}()
	}

	err = securitylogs_service.CreateSeclog(seclogs)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "Created", nil)
}

func ListPagination(c *gin.Context) {
	result, err := securitylogs_service.ListPagination(c)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}

func Detail(c *gin.Context) {
	id := c.Param("id")

	result, err := securitylogs_service.DetailSeclog(id)
	if err != nil {
		ResponseError(c, err)
		return
	}

	ResponseJSON(c, "", result)
}
