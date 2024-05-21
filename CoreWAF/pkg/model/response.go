package model

type ResponseBody struct {
	Code    int         `json:"code"`
	Message string      `json:"massage"`
	Data    interface{} `json:"data"`
}
