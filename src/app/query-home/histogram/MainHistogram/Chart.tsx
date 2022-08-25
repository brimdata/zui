import React from "react"
import {useSelector} from "react-redux"
import Dimens from "src/js/components/Dimens"
import {DateTuple} from "src/js/lib/TimeWindow"
import Histogram from "src/js/state/Histogram"
import Layout from "src/js/state/Layout"
import styled from "styled-components"

import ChartSVG from "../ChartSVG"
import useMainHistogram from "./useMainHistogram"

const BG = styled.div`
  height: 80px;
  margin: 12px 0;
`

export default function MainHistogramChart() {
  const show = useSelector(Layout.getShowHistogram)
  const range = useSelector(Histogram.getRange)
  if (!range) return null
  if (!show) return null
  return (
    <BG>
      <Dimens
        className="chart"
        data-testid="histogram"
        render={(rect) => (
          <MainHistogramSvg
            width={rect.width}
            height={rect.height}
            range={range}
          />
        )}
      />
    </BG>
  )
}

export type HistogramProps = {height: number; width: number; range: DateTuple}

function MainHistogramSvg(props: HistogramProps) {
  const chart = useMainHistogram(props)
  return <ChartSVG chart={chart} />
}
