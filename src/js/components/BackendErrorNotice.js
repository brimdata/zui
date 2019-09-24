/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactDom from "react-dom"

import {NetworkError} from "../models/Errors"
import {getBackendError, setBackendError} from "../backend"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace} from "../space/thunks"
import Notice from "./Notice"
import lib from "../lib"

export default function BackendErrorNotice() {
  let error = useSelector(getBackendError)
  let dispatch = useDispatch()
  let space = useSelector(getCurrentSpaceName)

  if (!error) return null

  return ReactDom.createPortal(
    renderError(error, dispatch, space),
    lib.doc.id("notification-root")
  )
}

function renderError(error, dispatch, space) {
  if (error instanceof NetworkError) {
    return (
      <Notice>
        <b>{error.title()}:</b> {error.message()}{" "}
        <a onClick={() => dispatch(initSpace(space))}>Retry</a>
      </Notice>
    )
  }

  return (
    <Notice>
      <b>{error.title()}:</b> {error.message()}{" "}
      <a onClick={() => dispatch(setBackendError(null))}>Dismiss</a>
    </Notice>
  )
}
