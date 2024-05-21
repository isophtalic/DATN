package utils

import "github.com/corazawaf/coraza/v3/types"

// obtainStatusCodeFromInterruptionOrDefault returns the desired status code derived from the interruption
// on a "deny" action or a default value.
func ObtainStatusCodeFromInterruptionOrDefault(it *types.Interruption, defaultStatusCode int) int {
	if it.Action == "deny" {
		statusCode := it.Status
		if statusCode == 0 {
			statusCode = 403
		}

		return statusCode
	}

	return defaultStatusCode
}
