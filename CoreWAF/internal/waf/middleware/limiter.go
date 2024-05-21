package middleware

import (
	"corewaf/pkg/model"
	"encoding/json"
	"net"
	"net/http"
	"sync"
	"time"
)

const DEFAULT_TIME_LIMIT = time.Minute * 5

func LimitRequest(next func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	limiter := model.NewClientLimiter()

	clients := make(map[string]*model.ClientLimiter)

	mu := sync.Mutex{}

	go func() {
		for ip, client := range clients {
			time.Sleep(time.Minute)
			mu.Lock()
			if time.Since(client.LastSeen) > DEFAULT_TIME_LIMIT {
				delete(clients, ip)
			}

			mu.Unlock()
		}
	}()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		mu.Lock()
		if _, found := clients[ip]; !found {
			clients[ip] = limiter
		}

		clients[ip].LastSeen = time.Now()
		if !clients[ip].Limiter.Allow() {
			mu.Unlock()
			w.WriteHeader(http.StatusTooManyRequests)
			respBody := model.ResponseBody{
				Code:    http.StatusTooManyRequests,
				Message: "Try again !",
				Data:    nil,
			}

			json.NewEncoder(w).Encode(&respBody)
			return
		}
		mu.Unlock()

		// handle next function
		next(w, r)
	})
}
