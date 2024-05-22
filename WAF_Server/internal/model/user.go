package model

import (
	"fmt"
	"time"
)

const (
	USER_ROOT = iota
	USER_ADMIN
)

type User struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key"`
	Username  string    `json:"username" gorm:"type:varchar(20);unique;not null"`
	Email     string    `json:"email" gorm:"type:varchar(20);unique;not null"`
	Password  string    `json:"_" gorm:"type:varchar(200);not null"`
	Role      int       `json:"role" gorm:"type:int"`
	Status    bool      `json:"status" gorm:"type:bool"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
}

type UserResponse struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key"`
	Username  string    `json:"username" gorm:"type:varchar(20);unique;not null"`
	Email     string    `json:"email" gorm:"type:varchar(20);unique;not null"`
	Role      int       `json:"role" gorm:"type:int"`
	Status    bool      `json:"status" gorm:"type:bool"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
}

func (user *User) Valid() error {
	if user.Role > 1 {
		return fmt.Errorf("permission denied")
	}

	return nil
}

type ChangePass struct {
	OldPass string `json:"oldpass"`
	NewPass string `json:"newpass"`
}
