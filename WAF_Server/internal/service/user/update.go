package service

import (
	"time"
	"waf_server/internal/persistence"

	"golang.org/x/crypto/bcrypt"
)

const (
	defaultPassword = "Thang832002@"
)

func ResetPassword(id string) error {
	user, err := persistence.User().FindUserByID(id)
	if err != nil {
		return err
	}

	password, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(password)
	user.UpdatedAt = time.Now()

	return persistence.User().UpdateByID(id, user)
}

func Delete(id string) error {
	return persistence.User().DeleteByID(id)
}
