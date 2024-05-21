package main

import (
	"log"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func InitalUser() error {
	log.Println("Initialling user root . . .")
	_, err := persistence.User().FindUserByUsername("admin")
	if err == nil {
		return nil
	}

	password, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	var user = model.User{
		ID:        uuid.NewString(),
		Email:     "admin@cyradar.com",
		Username:  "admin",
		Password:  string(password),
		Role:      model.USER_ROOT,
		Status:    true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return persistence.User().Save(&user)
}
