package mail

import (
	"bytes"
	"fmt"
	"net/smtp"
	"strings"
	"text/template"
	"waf_server/internal/model"

	"github.com/zerobounce/zerobouncego"
)

const (
	STATUS_VALID      = "valid"
	STATUS_INVALID    = "invalid"
	SMTP_HOST_DEFAULT = "smtp.gmail.com"
	SMTP_PORT_DEFAULT = "587"
	TEMPLATE_PATH     = "./template/template.html"
)

type MailPackage struct {
	zerobounce_api string
	register       string
	password       string
	smtp_host      string
	smtp_port      string
}

func NewMailPackage(register, password, zerobounce_api, host, port string) *MailPackage {
	if strings.TrimSpace(host) == "" {
		host = SMTP_HOST_DEFAULT
	}

	if strings.TrimSpace(host) == "" {
		host = SMTP_PORT_DEFAULT
	}

	return &MailPackage{
		zerobounce_api: zerobounce_api,
		register:       register,
		password:       password,
		smtp_host:      host,
		smtp_port:      port,
	}
}

func (m *MailPackage) VerifyMail(mail string) bool {
	zerobouncego.API_KEY = m.zerobounce_api
	response, _ := zerobouncego.Validate(mail, "")
	return response.IsValid()
}

func (m *MailPackage) SendEmail(actions model.Actions, receiver []string) error {
	from := m.register
	password := m.password

	auth := smtp.PlainAuth("", from, password, m.smtp_host)
	t, err := template.ParseFiles(TEMPLATE_PATH)
	if err != nil {
		return err
	}

	var body bytes.Buffer

	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body.Write([]byte(fmt.Sprintf("Notify ! \n%s\n\n", mimeHeaders)))

	t.Execute(&body, actions)

	dns := fmt.Sprintf("%s:%s", m.smtp_host, m.smtp_port)
	err = smtp.SendMail(dns, auth, from, receiver, body.Bytes())
	if err != nil {
		return err
	}

	return nil
}
