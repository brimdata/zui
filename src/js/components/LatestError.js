/* @flow */
import {connect} from "react-redux"
import React from "react"

import type {BrimError} from "../errors/types"
import type {State} from "../state/types"
import {first} from "../lib/Array"
import {reactElementProps} from "../test/integration"
import Errors from "../state/Errors"

type Props = {|error: BrimError|}

export function LatestError({error}: Props) {
  let message = error ? `${error.type}: ${error.message}` : ""

  return (
    <div className="latest-error" {...reactElementProps("notification")}>
      {message}
    </div>
  )
}

function stateToProps(state: State): Props {
  return {error: first(Errors.getErrors(state))}
}

export const XLatestError = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  null
)(LatestError)
