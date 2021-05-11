import {histogramSearch} from "app/search/flows/histogram-search"
import React, {useLayoutEffect, useMemo} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router"
import brim from "../brim"
import Chart from "../state/Chart"
import Url from "../state/Url"
import MainHistogramChart from "./charts/MainHistogram/Chart"

export default function SearchHeaderChart() {
  const location = useLocation()
  const dispatch = useDispatch()
  const {program, pins} = useSelector(Url.getSearchParams)

  const hasAnalytics = useMemo(
    () => brim.program(program, pins).hasAnalytics(),
    [program, pins]
  )
  const data = useSelector(Chart.getData)
  const status = useSelector(Chart.getStatus)

  const isEmpty = status === "SUCCESS" && data.keys.length === 0

  useLayoutEffect(() => {
    dispatch(histogramSearch())
  }, [location.key])

  if (isEmpty || hasAnalytics) return null
  return (
    <div className="search-page-header-charts">
      <MainHistogramChart />
    </div>
  )
}
