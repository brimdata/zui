import React from "react"
import {useDispatch} from "src/app/core/state"
import submitSearch from "src/app/query-home/flows/submit-search"
import ConnectionError from "src/js/components/ConnectionError"

export function isNetworkError(e: unknown) {
  return e === "The service could not be reached."
}

export function NetworkError() {
  const dispatch = useDispatch()
  return <ConnectionError onRetry={async () => dispatch(submitSearch())} />
}
