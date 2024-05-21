package service

import (
	"fmt"
	"strings"
	"time"
	"waf_server/internal/model"
	"waf_server/internal/persistence"
	"waf_server/internal/service"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProxyCreator struct {
	model.Proxy
	Source      model.Source      `json:"source"`
	Destination model.Destination `json:"destination"`
}

func Create(proxy_detail ProxyCreator, c *gin.Context) error {
	ok, err := govalidator.ValidateStruct(proxy_detail)
	if err != nil {
		return err
	}

	if !ok || len(strings.TrimSpace(proxy_detail.AccessListID_FK)) == 0 || len(strings.TrimSpace(proxy_detail.SecRuleID_FK)) == 0 {
		return fmt.Errorf("invalid input")
	}

	_, err = persistence.Accesslist().FindByID(proxy_detail.AccessListID_FK)
	if err != nil {
		return fmt.Errorf("invalid accesslist")
	}
	_, err = persistence.SecRuleSet().FindByID(proxy_detail.SecRuleID_FK)
	if err != nil {
		return fmt.Errorf("invalid secruleset")
	}

	proxy_detail.CreatedAt = time.Now()
	proxy_detail.UpdatedAt = time.Now()
	newProxy := proxy_detail.Proxy

	// source
	newSource := proxy_detail.Source
	newSource.SourceID = uuid.NewString()
	newSource.CreatedAt = time.Now()
	newSource.UpdatedAt = time.Now()
	newSource.ProxyID_FK = proxy_detail.ProxyID
	_, err = persistence.Source().FindByHostnameAndPort(newSource.HostName, newSource.Port)
	if err == nil {
		return fmt.Errorf("dublicate source")
	}

	// destinaion
	newDestination := proxy_detail.Destination
	newDestination.DestinationID = uuid.NewString()
	newDestination.SourceID_FK = newSource.SourceID
	_, err = persistence.Destination().FindBySourceID(newDestination.SourceID_FK)
	if err == nil {
		return fmt.Errorf("exist destination in source")
	}

	err = persistence.Source().Save(newSource)
	if err != nil {
		return err
	}

	err = persistence.Destination().Save(&newDestination)
	if err != nil {
		return err
	}

	err = persistence.Proxy().Save(newProxy)
	if err != nil {
		return err
	}

	actor := c.MustGet("user").(model.User).Username

	return service.CreateActions(model.ProxyViewerDetail{}, proxy_detail, proxy_detail.ProxyID, "Proxy", actor, model.ACTION_CREATE)
}
