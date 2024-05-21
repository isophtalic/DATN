package reverseproxy

import (
	"context"
	"corewaf/pkg/model"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func NewProxy(targetHost string) (*httputil.ReverseProxy, error) {
	url, err := url.Parse(targetHost)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(url)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
	}

	proxy.ErrorHandler = errorHandler()

	return proxy, nil
}

func modifyRequest(req *http.Request) {
	req.Header.Set("X-Proxy", "Waf-Reverse-Proxy")
}

func errorHandler() func(http.ResponseWriter, *http.Request, error) {
	return func(w http.ResponseWriter, req *http.Request, err error) {
		fmt.Printf("Got error while modifying response: %v \n", err)
	}
}

// ProxyRequestHandler handles the http request using proxy
func ProxyRequestHandler(proxy *httputil.ReverseProxy, MemStore *model.MemoryStore, ctx context.Context) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		handle := NewHandleRequestHandler(w, r, MemStore)

		ok := handle.Deny(ctx)
		if ok {
			return
		}

		proxy.ServeHTTP(w, r)
	}
}
