/* @flow */
import React from "react"
import classNames from "classnames"

import type {SpanArgs} from "../../state/search/types"
import brim from "../../brim"

export default function SpanDuration({spanArgs}: {spanArgs: SpanArgs}) {
  let span = brim.span(spanArgs)
  let error = !span.isValid()

  return (
    <div className={classNames("span-duration", {error})}>
      <hr />
      <span>{error ? "min > max" : span.format()}</span>
      <hr />
    </div>
  )
}
