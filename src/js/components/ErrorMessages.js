/* @flow */
import {connect} from "react-redux"
import React from "react"

import type {State} from "../state/types"
import {Subscript, Title} from "./Typography"
import {getErrors} from "../state/errors"
import AppError from "../models/AppError"

type Props = {errors: AppError[]}

export function ErrorMessages({errors}: Props) {
  return (
    <div className="error-messages">
      <Title>Errors</Title>
      <ul>
        {errors.map((e) => {
          return (
            <li key={e.ts.getTime()}>
              <b>{e.title()}</b>
              <br />
              {e.message()}
              <br />
              <Subscript>{e.ts.toString()}</Subscript>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function stateToProps(state: State) {
  return {errors: getErrors(state)}
}

export const XErrorMessages = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  null
)(ErrorMessages)
