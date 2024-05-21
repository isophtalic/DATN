package waf_const

const (
	DEFAULT_ENDPONT = "/"
	DEFAULT_PORT    = "8090"
)

type CtxKey string

// Define custom context keys
const (
	ServerKey CtxKey = "server"
	ApiKeyKey CtxKey = "apikey"
)
