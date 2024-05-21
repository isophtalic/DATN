// Copyright 2022 Juan Pablo Tosso and the OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

// tinygo does not support net.http so this package is not needed for it
//go:build !tinygo
// +build !tinygo

package middleware

import (
	"context"
	"corewaf/configs"
	"corewaf/internal/waf/interceptor"
	"corewaf/pkg/utils"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/corazawaf/coraza/v3"
	"github.com/corazawaf/coraza/v3/experimental"
	"github.com/corazawaf/coraza/v3/types"
)

// processRequest fills all transaction variables from an http.Request object
// Most implementations of Coraza will probably use http.Request objects
// so this will implement all phase 0, 1 and 2 variables
// Note: This function will stop after an interruption
// Note: Do not manually fill any request variables
func processRequest(tx types.Transaction, req *http.Request) (*types.Interruption, error) {
	var (
		client string
		cport  int
	)

	// IMPORTANT: Some http.Request.RemoteAddr implementations will not contain port or contain IPV6: [2001:db8::1]:8080
	idx := strings.LastIndexByte(req.RemoteAddr, ':')
	if idx != -1 {
		client = req.RemoteAddr[:idx]
		cport, _ = strconv.Atoi(req.RemoteAddr[idx+1:])
	}

	var in *types.Interruption
	// There is no socket access in the request object, so we neither know the server client nor port.
	tx.ProcessConnection(client, cport, "", 0)
	tx.ProcessURI(req.URL.String(), req.Method, req.Proto)
	for k, vr := range req.Header {
		for _, v := range vr {
			tx.AddRequestHeader(k, v)
		}
	}

	// Host will always be removed from req.Headers() and promoted to the
	// Request.Host field, so we manually add it
	if req.Host != "" {
		tx.AddRequestHeader("Host", req.Host)
		// This connector relies on the host header (now host field) to populate ServerName
		tx.SetServerName(req.Host)
	}

	// Transfer-Encoding header is removed by go/http
	// We manually add it to make rules relying on it work (E.g. CRS rule 920171)
	if req.TransferEncoding != nil {
		tx.AddRequestHeader("Transfer-Encoding", req.TransferEncoding[0])
	}

	in = tx.ProcessRequestHeaders()
	if in != nil {
		return in, nil
	}

	if tx.IsRequestBodyAccessible() {
		// We only do body buffering if the transaction requires request
		// body inspection, otherwise we just let the request follow its
		// regular flow.
		if req.Body != nil && req.Body != http.NoBody {
			it, _, err := tx.ReadRequestBodyFrom(req.Body)
			if err != nil {
				return nil, fmt.Errorf("failed to append request body: %s", err.Error())
			}

			if it != nil {
				return it, nil
			}

			rbr, err := tx.RequestBodyReader()
			if err != nil {
				return nil, fmt.Errorf("failed to get the request body: %s", err.Error())
			}

			// Adds all remaining bytes beyond the coraza limit to its buffer
			// It happens when the partial body has been processed and it did not trigger an interruption
			body := io.MultiReader(rbr, req.Body)
			// req.Body is transparently reinizialied with a new io.ReadCloser.
			// The http handler will be able to read it.
			// Prior to Go 1.19 NopCloser does not implement WriterTo if the reader implements it.
			// - https://github.com/golang/go/issues/51566
			// - https://tip.golang.org/doc/go1.19#minor_library_changes
			// This avoid errors like "failed to process request: malformed chunked encoding" when
			// using io.Copy.
			// In Go 1.19 we just do `req.Body = io.NopCloser(reader)`
			if rwt, ok := body.(io.WriterTo); ok {
				req.Body = struct {
					io.Reader
					io.WriterTo
					io.Closer
				}{body, rwt, req.Body}
			} else {
				req.Body = struct {
					io.Reader
					io.Closer
				}{body, req.Body}
			}
		}
	}

	for _, v := range tx.MatchedRules() {
		fmt.Println(v.ErrorLog())
	}
	return tx.ProcessRequestBody()
}

func WrapHandler(ctx context.Context, waf coraza.WAF, container configs.Container, h http.Handler) http.Handler {
	if waf == nil {
		return h
	}

	newTX := func(*http.Request) types.Transaction {
		return waf.NewTransaction()
	}

	if ctxwaf, ok := waf.(experimental.WAFWithOptions); ok {
		newTX = func(r *http.Request) types.Transaction {
			return ctxwaf.NewTransactionWithOptions(experimental.Options{
				Context: r.Context(),
			})
		}
	}

	fn := func(w http.ResponseWriter, r *http.Request) {

		// handle := reverseproxy.NewHandleRequestHandler(w, r, container.MemStore)
		// handle.PushRequestToKafka(ctx, r)

		fmt.Println(checkIPAccess(container, r))
		if checkIPAccess(container, r) {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		tx := newTX(r)
		defer func() {
			// We run phase 5 rules and create audit logs (if enabled)
			tx.ProcessLogging()
			// we remove temporary files and free some memory
			if err := tx.Close(); err != nil {
				tx.DebugLogger().Error().Err(err).Msg("Failed to close the transaction")
			}
		}()

		// Early return, Coraza is not going to process any rule
		if tx.IsRuleEngineOff() {
			// response writer is not going to be wrapped, but used as-is
			// to generate the response
			h.ServeHTTP(w, r)
			return
		}

		// ProcessRequest is just a wrapper around ProcessConnection, ProcessURI,
		// ProcessRequestHeaders and ProcessRequestBody.
		// It fails if any of these functions returns an error and it stops on interruption.
		it, err := processRequest(tx, r)
		if err != nil {
			tx.DebugLogger().Error().Err(err).Msg("Failed to process request")
			return
		} else if it != nil {
			w.WriteHeader(utils.ObtainStatusCodeFromInterruptionOrDefault(it, http.StatusOK))
			return
		}
		ww, processResponse := interceptor.Wrap(w, r, tx)

		// We continue with the other middlewares by catching the response
		h.ServeHTTP(ww, r)

		if err := processResponse(tx, r); err != nil {
			tx.DebugLogger().Error().Err(err).Msg("Failed to close the response")
			return
		}
	}

	return LimitRequest(http.HandlerFunc(fn))
}

func checkIPAccess(container configs.Container, r *http.Request) bool {
	ip := strings.Split(r.RemoteAddr, ":")[0]
	return container.IPBlackist.Exist(ip)
}
