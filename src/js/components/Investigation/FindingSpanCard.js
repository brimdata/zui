/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import type {DateTuple} from "../../lib/TimeWindow"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import {format} from "../../lib/Time"
import {setOuterTimeWindow} from "../../state/actions"
import SpanDuration from "../SpanDuration"

export default function FindingSpanCard({span}: {span: DateTuple}) {
  let dispatch = useDispatch()

  function onClick() {
    dispatch(setOuterTimeWindow(span))
    dispatch(fetchMainSearch({saveToHistory: false}))
  }

  return (
    <div className="finding-span-card" onClick={onClick}>
      <DatePill date={span[0]} />
      <SpanDuration span={span} />
      <DatePill date={span[1]} />
    </div>
  )
}

function DatePill({date}: {date: Date}) {
  return (
    <div className="thin-button date-pill">
      <span className="day">{format(date, "MMM DD, YYYY")}</span>
      <span className="time">{format(date, "HH:mm:ss")}</span>
    </div>
  )
}
