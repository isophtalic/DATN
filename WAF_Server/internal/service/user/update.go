package service

import (
	"fmt"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"golang.org/x/crypto/bcrypt"
)

const (
	DefaultPassword = "Thang832002@"
)

func ChangePassword(id string, cmd model.ChangePass, actor string) error {
	user, err := persistence.User().FindUserByID(id)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(cmd.OldPass))
	if err != nil {
		return fmt.Errorf("password not match")
	}

	password, err := bcrypt.GenerateFromPassword([]byte(cmd.NewPass), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(password)
	user.UpdatedAt = time.Now()

	err = persistence.User().UpdateByID(id, user)
	if err != nil {
		return err
	}

	return service.CreateActions("null", "null", id, "User", actor, "Change Password")
}

func Delete(id string) error {
	user, err := persistence.User().FindUserByID(id)
	if err != nil {
		return fmt.Errorf("cannot find user")
	}
	if user.Role == 0 {
		return fmt.Errorf("action not allow")
	}
	return persistence.User().DeleteByID(id)
}
