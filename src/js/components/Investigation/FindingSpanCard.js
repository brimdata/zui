/* @flow */
import React from "react"

import type {DateTuple} from "../../lib/TimeWindow"
import {format} from "../../lib/Time"
import SpanDuration from "../SpanDuration"

export default function FindingSpanCard({span}: {span: DateTuple}) {
  return (
    <div className="finding-span-card">
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
