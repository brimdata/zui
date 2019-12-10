/* @flow */

import React from "react"

import type {SearchResults} from "../../../state/searches/types"
import type {SpanArgs} from "../../../state/search/types"
import ChartSVG from "../ChartSVG"
import Dimens from "../../Dimens"
import brim from "../../../brim"
import useFindingHistogram from "./useFindingHistogram"

type Props = {
  results: SearchResults,
  spanArgs: SpanArgs
}

const Chart = React.memo<Props>(function Chart({results, spanArgs}: Props) {
  let span = brim.span(spanArgs).toDateTuple()
  return (
    <Dimens
      className="chart finding-histogram"
      render={({width, height}) => (
        <ChartSVG chart={useFindingHistogram(width, height, results, span)} />
      )}
    />
  )
})

export default Chart
