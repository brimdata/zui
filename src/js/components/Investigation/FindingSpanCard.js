/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import type {SpanArgs, TimeArg} from "../../state/search/types"
import {isString} from "../../lib/is"
import SpanDuration from "../Span/SpanDuration"
import brim from "../../brim"
import search from "../../state/search"
import submitSearch from "../../flows/submitSearch"

export default function FindingSpanCard({spanArgs}: {spanArgs: SpanArgs}) {
  let dispatch = useDispatch()

  function onClick() {
    dispatch(search.setSpanArgs(spanArgs))
    dispatch(submitSearch(false))
  }

  return (
    <div className="finding-card-wrapper">
      <div className="finding-span-card" onClick={onClick}>
        <DatePill date={spanArgs[0]} />
        <SpanDuration spanArgs={spanArgs} />
        <DatePill date={spanArgs[1]} />
      </div>
    </div>
  )
}

function DatePill({date}: {date: TimeArg}) {
  if (isString(date)) {
    return (
      <div className="thin-button date-pill">
        <span className="day">{date}</span>
      </div>
    )
  } else {
    return (
      <div className="thin-button date-pill">
        <span className="day">{brim.time(date).format("MMM DD, YYYY")}</span>
        <span className="time">{brim.time(date).format("HH:mm:ss")}</span>
      </div>
    )
  }
}
