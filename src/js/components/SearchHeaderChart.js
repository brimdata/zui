/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Investigation from "../state/Investigation"
import MainHistogramChart from "./charts/MainHistogram/Chart"
import brim from "../brim"

export default function SearchHeaderChart() {
  let finding = useSelector(Investigation.getCurrentFinding)
  let chartable = true

  if (finding) {
    let {program, pins} = finding.search
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
