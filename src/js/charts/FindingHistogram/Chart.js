/* @flow */

import React from "react"

import type {SearchResults} from "../../state/searches/types"
import type {Span} from "../../BoomClient/types"
import ChartSVG from "../ChartSVG"
import Dimens from "../../components/Dimens"
import useFindingHistogram from "./useFindingHistogram"

type Props = {
  results: SearchResults,
  span: Span
}

const Chart = React.memo<Props>(function Chart({results, span}: Props) {
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
