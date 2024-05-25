package mail_service

import (
	"waf_server/internal/configs"
	timescale_model "waf_server/internal/model/timescale"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/mail"
)

type MailService struct {
	sender       string
	password     string
	smtp_host    string
	smtp_port    string
	dashboard    string
	templatePath string
}

func NewMailService(c *configs.Configs) *MailService {
	return &MailService{
		sender:       c.EMAIL_SENDER,
		password:     c.EMAIL_PASSWORD,
		smtp_host:    c.SMTP_HOST,
		smtp_port:    c.SMTP_PORT,
		dashboard:    c.DASHBOARD,
		templatePath: c.MAIL_TEMPLATE_PATH,
	}
}

func (s *MailService) NotifyToAdmin(cmd timescale_model.SecLog) error {
	admin, err := persistence.User().FindUserByUsername("admin")
	if err != nil {
		return nil
	}

	producer := mail.NewMailPackage(s.sender, s.password, "", s.smtp_host, s.smtp_port, s.templatePath)
	subject := "Notify !"

	obj := mail.ObjectNotify{
		SecLog:    cmd,
		Dashboard: s.dashboard,
	}

	err = producer.SendEmail(obj, []string{admin.Email}, subject)
	if err != nil {
		return err
	}

	return nil
}
