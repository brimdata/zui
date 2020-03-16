/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import type {BrimError} from "../errors/types"
import NetworkErrorNotice from "./NetworkErrorNotice"
import Notice from "../state/Notice"
import NoticeBanner from "./NoticeBanner"
import useEscapeKey from "./hooks/useEscapeKey"

export default function ErrorNotice() {
  let error = useSelector(Notice.getError)
  let visible = useSelector(Notice.getVisible)

  return (
    <NoticeBanner show={visible}>
      <ErrorMessage error={error} />
    </NoticeBanner>
  )
}

function ErrorMessage({error}: {error: BrimError}) {
  let Component = getComponent(error)
  let dispatch = useDispatch()
  useEscapeKey(() => dispatch(Notice.dismiss()))
  return <Component error={error} />
}

function getComponent(error: BrimError) {
  if (error.type === "NetworkError") return NetworkErrorNotice
  else if (error) return Default
  else return None
}

function None() {
  return null
}

function Default({error}: {error: BrimError}) {
  let dispatch = useDispatch()
  let msg = capitalizeFirst(error.message)
  let details = error.details
  return (
    <>
      <p>
        {msg} <a onClick={() => dispatch(Notice.dismiss())}>Dismiss</a>
      </p>
      {details && details.length > 0 && (
        <div className="error-details">
          {details.map((string, i) => (
            <p key={i}>{string}</p>
          ))}
        </div>
      )}
    </>
  )
}

function capitalizeFirst(str) {
  if (str.length === 0) return str
  return str[0].toUpperCase() + str.slice(1)
}
