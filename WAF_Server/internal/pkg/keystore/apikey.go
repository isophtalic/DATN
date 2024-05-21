package keystore

import (
	"encoding/base64"
	"fmt"
	"strings"
)

func MakeApiKey(plaintext string, salt []byte) string {
	key := append([]byte(plaintext+"."), salt...)
	return base64.StdEncoding.EncodeToString(key)
}

func Decode(cipher string) (string, error) {
	plaintext, err := base64.StdEncoding.DecodeString(cipher)
	if err != nil {
		return "", nil
	}
	fgpr, _, err := splitApiKey(string(plaintext))
	return fgpr, err
}

func splitApiKey(apikey string) (apiKeyPlain, salt string, err error) {
	if len(apikey) == 0 {
		return "", "", fmt.Errorf("invalid apikey")
	}
	keyArray := strings.Split(apikey, ".")
	apiKeyPlain = keyArray[0]
	salt = keyArray[1]
	return
}
