/* @flow */
import React from "react"

import ChartSVG from "../ChartSVG"
import Dimens from "../../components/Dimens"
import useMainHistogram from "./useMainHistogram"

export default function MainHistogramChart() {
  return (
    <Dimens
      className="chart main-search-histogram"
      render={(rect) => (
        <MainHistogramSvg width={rect.width} height={rect.height} />
      )}
    />
  )
}

const MainHistogramSvg = React.memo(function MainHistogramSvg({width, height}) {
  let chart = useMainHistogram(width, height)
  return <ChartSVG chart={chart} />
})
