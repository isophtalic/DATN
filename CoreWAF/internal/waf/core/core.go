package core_waf

import (
	"context"
	"corewaf/configs"
	waf_const "corewaf/internal/const"
	reverseproxy "corewaf/internal/reverse_proxy"
	"corewaf/internal/waf/middleware"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	coreruleset "github.com/corazawaf/coraza-coreruleset"
	"github.com/corazawaf/coraza/v3"
	"github.com/corazawaf/coraza/v3/types"
)

type WAF struct {
	waf coraza.WAF
}

func CreateWAF(logError func(error types.MatchedRule)) *WAF {

	rec, err := os.ReadFile(filepath.Join("coraza.conf"))
	if err != nil {
		log.Fatal(err)
	}

	waf, err := coraza.NewWAF(
		coraza.NewWAFConfig().
			WithRootFS(coreruleset.FS).
			WithDirectives(string(rec)).
			WithErrorCallback(logError).
			WithDirectives("Include @crs-setup.conf.example").
			WithDirectives("Include @owasp_crs/*.conf"),
	)

	if err != nil {
		log.Fatal(err)
	}

	return &WAF{
		waf: waf,
	}
}

func (core *WAF) Start(container configs.Container, ctx context.Context) {
	reverse_px, err := reverseproxy.NewProxy(container.Configs.Target)
	if err != nil {
		panic(err)
	}

	waf := core.waf

	rpHandler := reverseproxy.ProxyRequestHandler(reverse_px, container.MemStore, ctx)

	mux := http.NewServeMux()
	mux.Handle(waf_const.DEFAULT_ENDPONT, middleware.WrapHandler(ctx, waf, container, http.HandlerFunc(rpHandler)))
	fmt.Printf("WAF is running. Listening port: %s \n", container.Port)

	port := fmt.Sprintf(":%s", container.Port)
	log.Fatalln(http.ListenAndServe(port, mux))
}
