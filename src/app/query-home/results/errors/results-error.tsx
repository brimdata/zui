import React from "react"
import {DefaultError} from "./default-error"
import {isMissingPoolError, MissingPoolError} from "./missing-pool-error"
import {isParseError, SyntaxError} from "./syntax-error"

export function ResultsError(props: {error: string | object}) {
  if (isParseError(props.error)) return <SyntaxError error={props.error} />
  if (isMissingPoolError(props.error)) return <MissingPoolError />
  return <DefaultError {...props} />
}
