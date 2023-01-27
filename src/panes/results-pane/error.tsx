import React from "react"
import {DefaultError} from "./errors/default-error"
import {isMissingPoolError, MissingPoolError} from "./errors/missing-pool-error"
import {isParseError, SyntaxError} from "./errors/syntax-error"

export function Error(props: {error: string | object}) {
  if (isParseError(props.error)) return <SyntaxError error={props.error} />
  if (isMissingPoolError(props.error)) return <MissingPoolError />
  return <DefaultError {...props} />
}
