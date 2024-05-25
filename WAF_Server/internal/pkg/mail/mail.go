package mail

import (
	"bytes"
	"fmt"
	"net/smtp"
	"strings"
	"text/template"
	timescale_model "waf_server/internal/model/timescale"

	"github.com/zerobounce/zerobouncego"
)

const (
	STATUS_VALID      = "valid"
	STATUS_INVALID    = "invalid"
	SMTP_HOST_DEFAULT = "smtp.gmail.com"
	SMTP_PORT_DEFAULT = "587"
	TEMPLATE_PATH     = "../mail/template/template.html"
)

type MailPackage struct {
	zerobounce_api string
	register       string
	password       string
	smtp_host      string
	smtp_port      string
	templatePath   string
}

func NewMailPackage(register, password, zerobounce_api, host, port, templatePath string) *MailPackage {
	if strings.TrimSpace(host) == "" {
		host = SMTP_HOST_DEFAULT
	}

	if strings.TrimSpace(port) == "" {
		port = SMTP_PORT_DEFAULT
	}

	return &MailPackage{
		zerobounce_api: zerobounce_api,
		register:       register,
		password:       password,
		smtp_host:      host,
		smtp_port:      port,
		templatePath:   templatePath,
	}
}

func (m *MailPackage) VerifyMail(mail string) bool {
	zerobouncego.API_KEY = m.zerobounce_api
	response, _ := zerobouncego.Validate(mail, "")
	return response.IsValid()
}

type ObjectNotify struct {
	timescale_model.SecLog
	Dashboard string
}

func (m *MailPackage) SendEmail(log ObjectNotify, receiver []string, subject string) error {
	from := m.register
	password := m.password

	auth := smtp.PlainAuth("", from, password, m.smtp_host)

	// Parse the HTML template
	t, err := template.ParseFiles(m.templatePath) // Ensure TEMPLATE_PATH is defined or replaced
	if err != nil {
		return fmt.Errorf("error parsing template: %w", err)
	}

	var body bytes.Buffer

	// Write headers
	body.Write([]byte(fmt.Sprintf("From: %s\r\n", from)))
	body.Write([]byte(fmt.Sprintf("To: %s\r\n", strings.Join(receiver, ", "))))
	body.Write([]byte(fmt.Sprintf("Subject: %s\r\n", subject)))
	body.Write([]byte("MIME-Version: 1.0\r\n"))
	body.Write([]byte("Content-Type: text/html; charset=\"UTF-8\"\r\n"))
	body.Write([]byte("\r\n")) // End of headers

	// Write the email body
	err = t.Execute(&body, log)
	if err != nil {
		return fmt.Errorf("error executing template: %w", err)
	}

	dns := fmt.Sprintf("%s:%s", m.smtp_host, m.smtp_port)
	fmt.Printf("Attempting to send mail to %v via %s\n", receiver, dns) // Debug print

	err = smtp.SendMail(dns, auth, from, receiver, body.Bytes())
	if err != nil {
		return fmt.Errorf("error sending mail: %w", err)
	}

	fmt.Println("Mail sent successfully!")
	return nil
}
