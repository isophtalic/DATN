package model

import (
	"sync"
)

type MemoryStore struct {
	sync.RWMutex
	data map[string][]MessageLog
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		data: make(map[string][]MessageLog),
	}
}

func (m *MemoryStore) Push(dataRaw MessageLog) error {
	m.Lock()
	defer m.Unlock()
	m.data[dataRaw.Client] = append(m.data[dataRaw.Client], dataRaw)
	return nil
}

func (m *MemoryStore) Get(clientIP string) ([]MessageLog, error) {
	m.Lock()
	defer m.Unlock()
	msgLogs, ok := m.data[clientIP]
	if !ok {
		return []MessageLog{}, nil
	}
	return msgLogs, nil
}

func (m *MemoryStore) GetAll() map[string][]MessageLog {
	m.Lock()
	defer m.Unlock()
	return m.data
}

func (m *MemoryStore) Remove(clientIP string) error {
	m.Lock()
	defer m.Unlock()
	delete(m.data, clientIP)
	return nil
}
