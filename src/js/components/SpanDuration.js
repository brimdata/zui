/* @flow */
import React from "react"

import type {SpanArgs} from "../state/search/types"
import {humanDuration} from "../lib/TimeWindow"
import brim from "../brim"
import span from "../brim/span"

export default function SpanDuration({spanArgs}: {spanArgs: SpanArgs}) {
  return (
    <div className="span-duration">
      <hr />
      <span>{humanDuration(brim.span(spanArgs).toDateTuple())}</span>
      <hr />
    </div>
  )
}
