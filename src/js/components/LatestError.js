/* @flow */
import {connect} from "react-redux"
import React from "react"

import type {State} from "../state/types"
import {first} from "../lib/Array"
import {reactElementProps} from "../test/integration"
import AppError from "../models/AppError"
import Errors from "../state/Errors"

type Props = {|error: AppError|}

export function LatestError({error}: Props) {
  let message = error ? `${error.title()}: ${error.message()}` : ""

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
