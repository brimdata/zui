/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Last from "../state/Last"
import MainHistogramChart from "./charts/MainHistogram/Chart"
import brim from "../brim"

export default function SearchHeaderChart() {
  const search = useSelector(Last.getSearch)
  let chartable = false

  if (search) {
    const {program, pins, target} = search
    chartable =
      target === "events" && !brim.program(program, pins).hasAnalytics()
  }

  if (!chartable) return null
  else
    return (
      <div className="search-page-header-charts">
        <MainHistogramChart />
      </div>
    )
}
