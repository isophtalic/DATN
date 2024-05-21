package reverseproxy

import (
	"bytes"
	"context"
	waf_const "corewaf/internal/const"
	"corewaf/internal/datastore"
	model "corewaf/pkg/model"
	modelLog "corewaf/pkg/model/auditlog"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
)

type HandleRequestHandler struct {
	W        http.ResponseWriter
	R        *http.Request
	MemStore *model.MemoryStore
}

func NewHandleRequestHandler(w http.ResponseWriter, r *http.Request, mem *model.MemoryStore) *HandleRequestHandler {
	return &HandleRequestHandler{
		W:        w,
		R:        r,
		MemStore: mem,
	}
}

func (cmd *HandleRequestHandler) Deny(ctx context.Context) bool {
	ip := strings.Split(cmd.R.RemoteAddr, ":")[0]

	logs, _ := cmd.MemStore.Get(ip)

	if len(logs) != 0 {
		cmd.W.Header().Set("Content-Type", "application/json")
		cmd.W.WriteHeader(403)
		err := json.NewEncoder(cmd.W).Encode(map[string]interface{}{
			"message": "Request is blocked by waf",
		})
		if err != nil {
			return false
		}

		arrayByteHeader, err := json.Marshal(cmd.R.Header)
		if err != nil {
			panic(err)
		}

		byteArrayBody, err := io.ReadAll(cmd.R.Body)
		if err != nil {
			panic(err)
		}

		formByteArray, err := json.Marshal(modelLog.RequestForm{
			FormValue: cmd.R.PostForm,
			FormFile:  cmd.R.MultipartForm,
		})

		if err != nil {
			panic(err)
		}

		secureLogs := modelLog.ArraySecureLogs{
			CreatedAt: logs[0].CreatedAt,
			ClientIP:  logs[0].Client,
			Host:      cmd.R.Host,
			Method:    cmd.R.Method,
			Proto:     cmd.R.Proto,
			URI:       cmd.R.RequestURI,
			Headers:   string(arrayByteHeader),
			Body:      string(byteArrayBody),
			Form:      string(formByteArray),
			Mess:      logs[0].Message,
			RuleID:    logs[0].Rules.ID(),
		}

		for _, v := range logs {
			secureLogs.SecureLogs = append(secureLogs.SecureLogs, cmd.convertToSecLog(v))
		}

		fmt.Println(ctx)

		err = cmd.SendToServer(secureLogs, ctx)
		if err != nil {
			log.Fatalln(">>>>", err)
			return false
		}

		// datastore.PrepareProducerKafka(ctx)

		// err = datastore.Request_Error().SendRequest(newSecLog)
		// if err != nil {
		// 	log.Println(err)
		// 	return true
		// }

		return cmd.MemStore.Remove(ip) == nil
	}

	return false
}

func (cmd *HandleRequestHandler) convertToSecLog(lg model.MessageLog) modelLog.SecurityLog {
	// newSecLog := modelLog.SecurityLog{
	// 	ID:         lg.ID,
	// 	Timestamp:  lg.CreatedAt,
	// 	ClientIP:   lg.Client,
	// 	Host:       cmd.R.Host,
	// 	Method:     cmd.R.Method,
	// 	Scheme:     cmd.R.URL.Scheme,
	// 	URI:        cmd.R.RequestURI,
	// 	RuleEngine: true,
	// 	Headers:    cmd.R.Header,
	// 	Message: modelLog.Message{
	// 		MessageID: uuid.NewString(),
	// 		Message:   lg.Message,
	// 		MessageData: modelLog.MessageData{
	// 			File:     lg.Rules.File(),
	// 			Line:     lg.Rules.Line(),
	// 			ID:       lg.Rules.ID(),
	// 			Rev:      lg.Rules.Revision(),
	// 			Data:     lg.Data,
	// 			Severity: lg.Rules.Severity().String(),
	// 			Ver:      lg.Rules.Version(),
	// 			Maturity: lg.Rules.Maturity(),
	// 			Accuracy: lg.Rules.Maturity(),
	// 			Tags:     lg.Rules.Tags(),
	// 			Raw:      lg.Rules.Raw(),
	// 		},
	// 	},
	// }

	newSecLog := modelLog.SecurityLog{
		RuleEngine: true,
		Filename:   lg.Rules.File(),
		Line:       lg.Rules.Line(),
		ID:         lg.Rules.ID(),
		Rev:        lg.Rules.Revision(),
		Msg:        lg.Message,
		Data:       lg.Data,
		Serverity:  lg.Rules.Severity().Int(),
		Ver:        lg.Rules.Version(),
		Maturity:   lg.Rules.Maturity(),
		Accuracy:   lg.Rules.Maturity(),
		Tags:       strings.Join(lg.Rules.Tags(), ","),
		Raw:        lg.Rules.Raw(),
	}
	return newSecLog
}

func (cmd *HandleRequestHandler) PushRequestToKafka(ctx context.Context, r *http.Request) error {
	byteArrayBody, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}

	reqLog := modelLog.RequestLog{
		ID:          uuid.NewString(),
		TimeRequest: time.Now(),
		ClientIP:    r.RemoteAddr,
		Host:        r.Host,
		Method:      r.Method,
		Proto:       r.Proto,
		URI:         r.RequestURI,
		Target:      "",
		Headers:     r.Header,
		Body:        string(byteArrayBody),
		Form: modelLog.RequestForm{
			FormValue: r.PostForm,
			FormFile:  r.MultipartForm,
		},
	}

	datastore.PrepareProducerKafka(ctx)

	err = datastore.Request().SendRequest(reqLog)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (cmd *HandleRequestHandler) SendToServer(data any, ctx context.Context) error {
	url := ctx.Value(waf_const.ServerKey).(string)
	apikey := ctx.Value(waf_const.ApiKeyKey).(string)
	log.Print(url)
	log.Print(apikey)

	jsonStr, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/api/v1/seclog", url), bytes.NewBuffer(jsonStr))
	if err != nil {
		return fmt.Errorf("error creating request: %s", err.Error())
	}

	// Set the appropriate headers for your request, such as Content-Type
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", apikey)

	// Create an HTTP client
	client := &http.Client{
		Timeout: time.Second * 10,
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending request: %s", err.Error())
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		strByte, _ := io.ReadAll(resp.Body)
		fmt.Println(string(strByte))
		fmt.Println(resp.StatusCode)
		return fmt.Errorf("request fail")
	}

	return nil
}
