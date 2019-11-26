/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {NetworkError} from "../models/Errors"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace} from "../space/thunks"
import NoticeBanner from "./NoticeBanner"
import notice from "../state/notice"
import useEscapeKey from "../hooks/useEscapeKey"

export default function ErrorNotice() {
  let error = useSelector(notice.getError)
  let visible = useSelector(notice.getVisible)

  return (
    <NoticeBanner show={visible}>
      <ErrorMessage error={error} />
    </NoticeBanner>
  )
}

function ErrorMessage({error}) {
  let Component = getComponent(error)
  let dispatch = useDispatch()
  useEscapeKey(() => dispatch(notice.dismiss()))
  return <Component error={error} />
}

function getComponent(error) {
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
    <p>
      {error.message()} <a onClick={() => dispatch(initSpace(space))}>Retry</a>
      <a onClick={() => dispatch(notice.dismiss())}>Dismiss</a>
    </p>
  )
}

function Default({error}) {
  let dispatch = useDispatch()
  return (
    <p>
      {error.message()}{" "}
      <a onClick={() => dispatch(notice.dismiss())}>Dismiss</a>
    </p>
  )
}
