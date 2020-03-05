/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {NetworkError} from "../models/Errors"
import {capitalize} from "../lib/Str"
import NetworkErrorNotice from "./NetworkErrorNotice"
import Notice from "../state/Notice"
import NoticeBanner from "./NoticeBanner"
import useEscapeKey from "./hooks/useEscapeKey"
import ErrorFactory from "../models/ErrorFactory"

export default function ErrorNotice() {
  let error = useSelector(Notice.getError)
  let visible = useSelector(Notice.getVisible)
  error = error && ErrorFactory.create(error)

  return (
    <NoticeBanner show={visible}>
      <ErrorMessage error={error} />
    </NoticeBanner>
  )
}

function ErrorMessage({error}) {
  let Component = getComponent(error)
  let dispatch = useDispatch()
  useEscapeKey(() => dispatch(Notice.dismiss()))
  return <Component error={error} />
}

function getComponent(error) {
  if (error instanceof NetworkError) return NetworkErrorNotice
  else if (error) return Default
  else return None
}

function None() {
  return null
}

function Default({error}) {
  let dispatch = useDispatch()
  let msg = capitalize(error.message())
  let details = error.details()
  return (
    <>
      <p>
        {msg} <a onClick={() => dispatch(Notice.dismiss())}>Dismiss</a>
      </p>
      {details.length > 0 && (
        <div className="error-details">
          {details.map((string, i) => (
            <p key={i}>{string}</p>
          ))}
        </div>
      )}
    </>
  )
}
