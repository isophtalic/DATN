package utils_cache

import (
	"time"

	"github.com/patrickmn/go-cache"
)

type Cache struct {
	cache *cache.Cache
}

func NewCache(time_duration, time_cleanup_interval time.Duration) *Cache {
	c := cache.New(time_duration, time_cleanup_interval)
	return &Cache{cache: c}
}

func (c *Cache) Set(key string, value interface{}, expr time.Duration) {
	c.cache.Set(key, value, expr)
}

func (c *Cache) Get(key string) (interface{}, bool) {
	return c.cache.Get(key)
}
