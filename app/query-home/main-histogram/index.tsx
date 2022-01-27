import React, {useLayoutEffect, useMemo} from "react"

import ChartSVG from "./chart-svg"
import Dimens from "./dimens"
import useMainHistogram from "./use-main-histogram"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import Url from "src/js/state/Url"
import brim from "src/js/brim"
import Chart from "src/js/state/Chart"
import {histogramSearch} from "../flows/histogram-search"

const MainHistogram = () => {
  const location = useSelector(Current.getLocation)
  const dispatch: AppDispatch = useDispatch()
  const {program, pins} = useSelector(Url.getSearchParams)

  const hasAnalytics = useMemo(
    () => brim.program(program, pins).hasAnalytics(),
    [program, pins]
  )
  const data = useSelector(Chart.getData)
  const status = useSelector(Chart.getStatus)
  const searchKey = useSelector(Chart.getSearchKey)

  const isEmpty = status === "SUCCESS" && data.keys.length === 0

  useLayoutEffect(() => {
    if (status === "INIT" || searchKey !== location.key) {
      dispatch(histogramSearch()).catch((e) => console.log(e))
    }
  }, [location.key])

  if (isEmpty || hasAnalytics) return null

  return (
    <Dimens
      className="chart main-search-histogram"
      data-testid="histogram"
      render={(rect) => (
        <MainHistogramSvg width={rect.width} height={rect.height} />
      )}
    />
  )
}

type Props = {height: number; width: number}

const MainHistogramSvg = React.memo(function MainHistogramSvg({
  width,
  height
}: Props) {
  const chart = useMainHistogram(width, height)
  return <ChartSVG chart={chart} />
})

export default MainHistogram
