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
  let Message = getMessageComponent(error)

  return ReactDom.createPortal(
    <Notice show={!!error}>
      <Message error={error} />
    </Notice>,
    lib.doc.id("notification-root")
  )
}

function getMessageComponent(error) {
  if (error instanceof NetworkError) return Network
  else return Default
}

function Network({error}) {
  let dispatch = useDispatch()
  let space = useSelector(getCurrentSpaceName)
  return (
    <>
      <b>{error.title()}:</b> {error.message()}{" "}
      <a onClick={() => dispatch(initSpace(space))}>Retry</a>
    </>
  )
}

function Default({error}) {
  let dispatch = useDispatch()
  return (
    <>
      <b>{error.title()}:</b> {error.message()}{" "}
      <a onClick={() => dispatch(setBackendError(null))}>Dismiss</a>
    </>
  )
}
