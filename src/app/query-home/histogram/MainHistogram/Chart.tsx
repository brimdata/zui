import React from "react"
import {useSelector} from "react-redux"
import {ZedScript} from "src/app/core/models/zed-script"
import Dimens from "src/js/components/Dimens"
import Results from "src/js/state/Results"
import styled from "styled-components"

import ChartSVG from "../ChartSVG"
import {HISTOGRAM_RESULTS} from "../run-histogram-query"
import useMainHistogram from "./useMainHistogram"

const BG = styled.div`
  height: 80px;
  margin: 24px 16px 16px 16px;
`

export default function MainHistogramChart() {
  const query = useSelector(Results.getQuery(HISTOGRAM_RESULTS))
  const range = new ZedScript(query).range
  if (!range) return null
  return (
    <BG>
      <Dimens
        className="chart main-search-histogram"
        data-testid="histogram"
        render={(rect) => (
          <MainHistogramSvg width={rect.width} height={rect.height} />
        )}
      />
    </BG>
  )
}

type Props = {height: number; width: number}

function MainHistogramSvg({width, height}: Props) {
  const chart = useMainHistogram(width, height)
  return <ChartSVG chart={chart} />
}
