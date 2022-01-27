import React from "react"
import classNames from "classnames"

import {SpanArgs} from "src/js/state/Search/types"
import brim from "src/js/brim"

const SpanDuration = ({spanArgs}: {spanArgs: SpanArgs}) => {
  const span = brim.span(spanArgs)
  const error = !span.isValid()
  return (
    <div className={classNames("span-duration", {error})}>
      <hr />
      <span>{error ? "!!!" : span.shortFormat()}</span>
      <hr />
    </div>
  )
}

export default SpanDuration
