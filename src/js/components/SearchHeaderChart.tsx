import {useDispatch, useSelector} from "react-redux"
import React, {useLayoutEffect} from "react"

import MainHistogramChart from "./charts/MainHistogram/Chart"
import brim from "../brim"
import {useLocation} from "react-router"
import {histogramSearch} from "app/search/flows/histogram-search"
import {decodeSearchParams} from "app/search/utils/search-params"
import {addEveryCountProc} from "../searches/histogramSearch"
import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import Current from "../state/Current"

export default function SearchHeaderChart() {
  const location = useLocation()
  const dispatch = useDispatch()
  const space = useSelector(Current.mustGetSpace)
  const {program, spanArgs, pins} = decodeSearchParams(location.search)
  const brimProgram = brim.program(program, pins)

  useLayoutEffect(() => {
    const [from, to] = brim
      .span(mergeDefaultSpanArgs(spanArgs, space))
      .toDateTuple()
    const query = addEveryCountProc(brimProgram.string(), [from, to])
    dispatch(histogramSearch({query, from, to}))
  }, [location])

  if (brimProgram.hasAnalytics()) return null
  return (
    <div className="search-page-header-charts">
      <MainHistogramChart />
    </div>
  )
}
