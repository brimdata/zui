import React from "react"
import {useSelector} from "react-redux"
import Dimens from "src/js/components/Dimens"
import {DateTuple} from "src/js/lib/TimeWindow"
import Histogram from "src/js/state/Histogram"
import styled from "styled-components"

import ChartSVG from "../ChartSVG"
import useMainHistogram from "./useMainHistogram"

const BG = styled.div`
  height: 80px;
  margin: 24px 16px 16px 16px;
`

export default function MainHistogramChart() {
  const range = useSelector(Histogram.getRange)
  console.log(range)
  if (!range) return null
  return (
    <BG>
      <Dimens
        className="chart main-search-histogram"
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
