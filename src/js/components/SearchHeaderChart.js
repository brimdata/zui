/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import MainHistogramChart from "./charts/MainHistogram/Chart"
import Tab from "../state/Tab"
import brim from "../brim"

export default function SearchHeaderChart() {
  let searchRecord = useSelector(Tab.currentEntry)
  let chartable = true

  if (searchRecord) {
    let {program, pins} = searchRecord
    console.log(brim.program(program, pins).string())
    chartable = !brim.program(program, pins).hasAnalytics()
  }

  if (!chartable) return null
  else
    return (
      <div className="search-page-header-charts">
        <MainHistogramChart />
      </div>
    )
}
