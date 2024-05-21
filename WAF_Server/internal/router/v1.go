package router

import (
	"time"
	"waf_server/internal/app"
	"waf_server/internal/configs"
	"waf_server/internal/pkg/middleware"
	serviceBlackist "waf_server/internal/service/accesslist/blacklist"
	serviceDestination "waf_server/internal/service/destination"
	serviceProxy "waf_server/internal/service/proxy"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewApiV1(container configs.Container) *gin.Engine {
	userHandler := new(app.UserHandler)

	serviceProxy := new(serviceProxy.ServiceProxyHandler)
	proxyhandler := &app.ProxyHandler{
		Service: serviceProxy,
	}

	sourceHandler := &app.SourceHandler{}

	svBlacklist := new(serviceBlackist.ServiceBlacklistHandler)
	accessListHandler := app.AccesslistHandler{
		ServiceBlacklist: *svBlacklist,
	}

	serviceDestination := new(serviceDestination.ServiceDestinationHandler)
	destinationHandler := app.DestinationHandler{
		Service: serviceDestination,
	}

	secrulesetHandler := app.SecRuleSetHandler{}
	rsHandler := app.RuleSethandler{}
	dataHandler := app.Datahandler{}

	actionHandler := app.ActionsHandler{}
	overviewHandler := app.OverviewHandler{}

	server := gin.Default()
	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	v1 := server.RouterGroup.Group("api/v1")
	authRouter(v1)
	v1.Use(
		middleware.AuthRequired(*container.JWT_Sercret),
	)

	// user
	userRouter := v1.Group("/user")
	userRouter.GET("", userHandler.ListUser)
	userRouter.POST("", userHandler.CreateAccount)
	userRouter.POST("/:id/reset-password", userHandler.ResetPassword)
	userRouter.POST("/:id/delete", userHandler.DeleteByID)

	// proxy
	proxyRouter := v1.Group("/proxy")
	proxyRouter.GET("/", proxyhandler.ListProxy)
	proxyRouter.POST("/", proxyhandler.CreateProxy)
	proxyRouter.GET("/:id/secrule", secrulesetHandler.FindByProxyID)
	proxyRouter.GET("/:id/source", sourceHandler.FindByProxyID)
	// proxyRouter.GET("/:id/accesslist", accessListHandler.FindByProxyID)
	proxyRouter.DELETE("/:id", proxyhandler.DeleteByID)
	proxyRouter.PATCH("/:id", proxyhandler.UpdateByID)

	proxyRouterViewer := v1.Group("/proxy-viewer")
	proxyRouterViewer.GET("", proxyhandler.ViewProxy)
	proxyRouterViewer.GET("/:id", proxyhandler.ProxyDetail)

	// source
	sourceRouter := v1.Group("/source")
	sourceRouter.GET("", sourceHandler.ListSource)
	sourceRouter.POST("", sourceHandler.CreateSource)
	sourceRouter.GET("/:id/destination", destinationHandler.FindBySource)
	sourceRouter.GET("/:id", sourceHandler.FindByID)

	// accesslist
	accesslistRouter := v1.Group("/accesslist")
	accesslistRouter.GET("", accessListHandler.List)
	accesslistRouter.POST("", accessListHandler.CreateAccesslist)
	accesslistRouter.GET("/:id", accessListHandler.DetailAccesslist)
	accesslistRouter.GET("/:id/blacklist", accessListHandler.FindBlacklist)
	accesslistRouter.GET("/:id/proxies", accessListHandler.FindProxy)

	// blacklist
	blacklistRouter := v1.Group("/blacklist")
	blacklistRouter.POST("", accessListHandler.CreateBlackist)

	// desttination
	destRouter := v1.Group("/destination")
	destRouter.POST("", destinationHandler.NewDestination)
	destRouter.GET("", destinationHandler.List)
	destRouter.GET("/:id", destinationHandler.FindByID)

	// secruleset
	srsRouter := v1.Group("/secrule")
	srsRouter.GET("", secrulesetHandler.List)
	srsRouter.POST("", secrulesetHandler.Create)
	srsRouter.GET("/:id", secrulesetHandler.FindByID)
	srsRouter.GET("/:id/ruleset", rsHandler.FindBySecID)
	srsRouter.GET("/:id/data", dataHandler.FindBySecID)
	srsRouter.PATCH("/:id", secrulesetHandler.UpdateByID)
	srsRouter.DELETE("/:id", secrulesetHandler.DeleteByID)

	// ruleset
	rsRouter := v1.Group("/ruleset")
	rsRouter.GET("", rsHandler.List)
	rsRouter.POST("", rsHandler.Create)
	rsRouter.GET("/:id", rsHandler.FindByID)
	rsRouter.PATCH("/:id", rsHandler.UpdateByID)
	rsRouter.DELETE("/:id", rsHandler.DeleteByID)

	// data
	dataRouter := v1.Group("/data")
	dataRouter.GET("", dataHandler.List)
	dataRouter.POST("", dataHandler.Create)
	dataRouter.GET("/:id", dataHandler.FindByID)
	dataRouter.POST("/:id", dataHandler.UpdateByID)
	dataRouter.DELETE("/:id", dataHandler.DeleteByID)

	// action
	actionRouter := v1.Group("actions")
	actionRouter.GET("", actionHandler.ListActions)
	actionRouter.GET("/detail/:id", actionHandler.Detail)
	actionRouter.GET("/target/:id", actionHandler.DetailByTarget)

	// seclog
	securelogRouter := v1.Group("seclog")
	securelogRouter.POST("", app.CreateSeclog)
	securelogRouter.GET("", app.ListPagination)
	securelogRouter.GET("/:id", app.Detail)

	// overview
	overviewRouter := v1.Group("overview")
	overviewRouter.GET("", overviewHandler.Overview)

	return server
}
