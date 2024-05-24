package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"
	"waf_server/internal/persistence"
	"waf_server/internal/pkg/keystore"
	utils_jwt "waf_server/internal/utils/jwt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	HEADER_API_KEY = "x-api-key"
	KEY            = "isophtalic"
)

func AuthRequired(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {

		if ok := middlewareApiKey(c); ok {
			c.Set("user", "admin")
			c.Next()
			return
		}

		var claims utils_jwt.CustomClaims
		tokenString := strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(c.Request.Header.Get("Authorization")), "Bearer"))
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || token == nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		expTime := claims.ExpiresAt.Time
		if time.Now().After(expTime) {
			c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"message": "token expired",
				"data":    nil,
			})
			c.Abort()
			return
		}

		user, err := persistence.User().FindUserByUsername(claims.Subject)
		if err != nil {
			c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"message": "unauthenticated",
				"data":    nil,
			})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

func middlewareApiKey(c *gin.Context) bool {
	apikey := strings.TrimSpace(c.Request.Header.Get(HEADER_API_KEY))
	plaintext, err := keystore.Decode(apikey)
	if err != nil {
		fmt.Println(err)
		return false
	}

	if plaintext != KEY {
		return false
	}

	return true
}
