package utils_jwt

import (
	"time"
	"waf_server/internal/model"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenResponse struct {
	Token string `json:"token"`
}

type CustomClaims struct {
	Role                 int `json:"role"`
	jwt.RegisteredClaims `json:",inline"`
}

func createAuthToken(claims CustomClaims, secret string) (TokenResponse, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	tokenString, e := token.SignedString([]byte(secret))

	return TokenResponse{tokenString}, e

}

func IssueAuthToken(u model.User, secret string, expiredAt time.Time) (TokenResponse, error) {
	return createAuthToken(CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "waf-dashboard",
			Audience:  []string{"waf-dashboard"},
			ExpiresAt: jwt.NewNumericDate(expiredAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.NewString(),
			Subject:   u.Username,
		},
		Role: u.Role,
	}, secret)
}
