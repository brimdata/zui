import React from "react"
import {submitSearch} from "src/domain/session/handlers"
import ConnectionError from "src/js/components/ConnectionError"

export function isNetworkError(e: unknown) {
  return e === "The service could not be reached."
}

export function NetworkError() {
  return <ConnectionError onRetry={async () => submitSearch()} />
}
