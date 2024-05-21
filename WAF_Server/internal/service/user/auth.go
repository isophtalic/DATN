package service

import (
	"crypto/ecdsa"
	"fmt"
	"time"
	"waf_server/internal/persistence"
	utils_jwt "waf_server/internal/utils/jwt"

	"golang.org/x/crypto/bcrypt"
)

const KEY_TOKEN_CACHE = "%s_jwt"

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (auth *AuthRequest) Login(secret *ecdsa.PrivateKey) (utils_jwt.TokenResponse, error) {
	user, err := persistence.User().FindUserByUsername(auth.Username)
	if err != nil {
		return utils_jwt.TokenResponse{}, fmt.Errorf("unauthenticated")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(auth.Password)); err != nil {
		return utils_jwt.TokenResponse{}, fmt.Errorf("unauthenticated")
	}

	token, err := utils_jwt.IssueAuthToken(user, secret, time.Now().Add(time.Hour*24))
	if err != nil {
		fmt.Println(err)
		return utils_jwt.TokenResponse{}, fmt.Errorf("unable to create token")
	}

	return token, nil
}
