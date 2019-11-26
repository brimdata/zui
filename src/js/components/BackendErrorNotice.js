/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactDom from "react-dom"

import {NetworkError} from "../models/Errors"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace} from "../space/thunks"
import Notice from "./Notice"
import lib from "../lib"
import notice from "../state/notice"
import useListener from "../hooks/useListener"

export default function BackendErrorNotice() {
  let error = useSelector(notice.getError)
  let dispatch = useDispatch()
  let visible = useSelector(notice.getVisible)
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
  else if (error) return Default
  else return None
}

function None() {
  return null
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
      <a onClick={() => dispatch(notice.dismiss())}>Dismiss</a>
    </>
  )
}
