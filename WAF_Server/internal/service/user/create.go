package service

import (
	"encoding/json"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AccountRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func Create(acc *AccountRequest, c *gin.Context) error {
	var user = model.User{}

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.Role = 1
	user.Status = true
	passwordArrByte, err := bcrypt.GenerateFromPassword([]byte(acc.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(passwordArrByte)
	user.Username = acc.Username
	user.Email = acc.Email
	user.ID = uuid.NewString()

	err = persistence.User().Save(&user)
	if err != nil {
		return err
	}

	userByteArr, _ := json.Marshal(user)

	newAction := model.Actions{
		ID:          uuid.NewString(),
		CreatedAt:   time.Now(),
		Name:        model.ACTION_CREATE,
		Target:      "Create User",
		TargetID:    user.ID,
		InitiatedBy: c.MustGet("user").(model.User).Username,
		Changes:     string(userByteArr),
	}

	return persistence.Actions().Save(newAction)
}
