package router

import (
	"waf_server/internal/app"

	"github.com/gin-gonic/gin"
)

func authRouter(parent *gin.RouterGroup) {
	authHandler := new(app.AuthHandler)
	routeAuth := parent.Group("/auth")
	routeAuth.POST("/base-login", authHandler.Login)
}

func userRouter(parent *gin.RouterGroup) {
	userHandler := new(app.UserHandler)
	router := parent.Group("/user")
	router.GET("", userHandler.ListUser)
	router.POST("", userHandler.CreateAccount)
}
