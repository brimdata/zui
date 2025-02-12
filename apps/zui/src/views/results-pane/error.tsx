import React from "react"
import {DefaultError} from "./errors/default-error"
import {isParseError, SyntaxError} from "./errors/syntax-error"
import {isNetworkError, NetworkError} from "./errors/network-error"
import {isEmptyQueryError} from "./errors/empty-query"

export function Error(props: {error: string | object}) {
  if (isEmptyQueryError(props.error)) return null
  if (isParseError(props.error)) return <SyntaxError error={props.error} />
  if (isNetworkError(props.error)) return <NetworkError />
  return <DefaultError {...props} />
}
