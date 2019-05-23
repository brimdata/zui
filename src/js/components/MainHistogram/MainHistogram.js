/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {getHistogramSearch} from "../../state/searches/selector"
import {
  getInnerTimeWindow,
  getTimeWindow
} from "../../state/reducers/timeWindow"
import {resultsToLogs} from "../../log/resultsToLogs"
import D3Chart from "../D3Chart"
import buildElements from "./buildElements"
import formatMainHistogramData from "./formatMainHistogramData"

export default function MainSearchHistogram() {
  let search = useSelector(getHistogramSearch)
  if (!search) return null
  let logs = resultsToLogs(search.results, "0")
  let span = useSelector(getTimeWindow)
  let innerSpan = useSelector(getInnerTimeWindow)
  let isFetching = search.status === "FETCHING"
  let dispatch = useDispatch()

  return (
    <D3Chart
      className="main-search-histogram"
      data={formatMainHistogramData(logs, span)}
      margins={{left: 0, right: 0, top: 3, bottom: 16}}
      state={{selection: innerSpan, isFetching, isEmpty: logs.length === 0}}
      buildElements={buildElements(dispatch)}
    />
  )
}
