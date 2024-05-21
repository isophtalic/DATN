package model

import (
	"slices"
	"sync"
)

type IPBlackist struct {
	sync.RWMutex
	Blackist []string
}

func NewIPBlacklist() *IPBlackist {
	return &IPBlackist{
		Blackist: []string{},
	}
}

func (mem *IPBlackist) Push(ip string) {
	mem.Lock()
	defer mem.Unlock()

	mem.Blackist = append(mem.Blackist, ip)
}

func (mem *IPBlackist) Exist(ip string) bool {
	mem.RLock()
	defer mem.RUnlock()

	return slices.Index(mem.Blackist, ip) != -1
}
