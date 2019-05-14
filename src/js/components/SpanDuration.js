/* @flow */
import React from "react"

import {type DateTuple, humanDuration} from "../lib/TimeWindow"

export default function SpanDuration({span}: {span: DateTuple}) {
  return (
    <div className="span-duration">
      <hr />
      <p>{humanDuration(span)}</p>
      <hr />
    </div>
  )
}
