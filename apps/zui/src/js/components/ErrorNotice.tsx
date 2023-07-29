import {upperFirst} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {ErrorData} from "../errors/types"
import NetworkErrorNotice from "./NetworkErrorNotice"
import Notice from "../state/Notice"
import NoticeBanner from "./NoticeBanner"
import useEscapeKey from "./hooks/useEscapeKey"

export default function ErrorNotice() {
  const error = useSelector(Notice.getError)
  const visible = useSelector(Notice.getVisible)

  return (
    <NoticeBanner role="alert" show={visible}>
      <ErrorMessage error={error} />
    </NoticeBanner>
  )
}

function ErrorMessage({error}: {error: ErrorData}) {
  const Component = getComponent(error)
  const dispatch = useDispatch()
  useEscapeKey(() => dispatch(Notice.dismiss()))
  return <Component error={error} />
}

function getComponent(error: ErrorData) {
  if (error.type === "NetworkError") return NetworkErrorNotice
  else if (error) return Default
  else return None
}

function None() {
  return null
}

function Default({error}: {error: ErrorData}) {
  const dispatch = useDispatch()
  const msg = upperFirst(error.message)

  const generateErrorDetails = (details) => {
    // in case the backend returns a single string instead of array
    let detailsContent = null
    if (typeof details === "string" || details instanceof String)
      detailsContent = details.split("\n")
    else if (Array.isArray(details) && details.length > 0)
      detailsContent = details.flatMap((s) => s.split("\n"))

    if (!detailsContent) return null

    return (
      <div className="error-details">
        {detailsContent.map((detail, i) => (
          <p key={i}>{detail}</p>
        ))}
      </div>
    )
  }
  return (
    <>
      <p>
        {msg} <a onClick={() => dispatch(Notice.dismiss())}>Dismiss</a>
      </p>
      {generateErrorDetails(error.details)}
    </>
  )
}
