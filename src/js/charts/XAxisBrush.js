/* @flow */

import * as d3 from "d3"
import type {ChartElement} from "../models/Chart"
import Chart from "../models/Chart"
import isEqual from "lodash/isEqual"
import {setInnerTimeWindow, setOuterTimeWindow} from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"

export default class HistogramBrush implements ChartElement {
  dispatch: Function

  constructor(dispatch: Function) {
    this.dispatch = dispatch
  }

  mount(chart: Chart) {
    d3.select(chart.svg)
      .append("g")
      .attr("class", "brush")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
  }

  draw(chart: Chart) {
    let prevSelection = null
    let justClicked = false
    let timeout
    const dispatch = this.dispatch

    function onBrushStart() {
      prevSelection = d3.brushSelection(
        d3
          .select(chart.svg)
          .select(".brush")
          .node()
      )
    }

    function onBrushEnd() {
      const {selection, sourceEvent} = d3.event
      if (!sourceEvent) {
        return
      }
      if (!selection) {
        dispatch(setInnerTimeWindow(null))
        dispatch(fetchMainSearch({saveToHistory: false}))
        return
      }
      if (!isEqual(selection, prevSelection)) {
        dispatch(
          setInnerTimeWindow(selection.map(chart.scales.timeScale.invert))
        )
        dispatch(fetchMainSearch({saveToHistory: false}))
        return
      }
      const [x] = d3.mouse(this)
      const [start, end] = selection
      const withinSelection = x >= start && x <= end
      const singleClickedSelection = withinSelection && !justClicked
      const doubleClickedSelection = withinSelection && justClicked
      if (singleClickedSelection) {
        justClicked = true
        timeout = setTimeout(() => (justClicked = false), 400)
        return
      }
      if (doubleClickedSelection) {
        dispatch(
          setOuterTimeWindow(selection.map(chart.scales.timeScale.invert))
        )
        dispatch(setInnerTimeWindow(null))
        dispatch(fetchMainSearch())
        justClicked = false
        clearTimeout(timeout)
        return
      }
    }

    const element = d3.select(".brush")
    const brush = d3
      .brushX()
      .extent([[0, 0], [chart.dimens.innerWidth, chart.dimens.innerHeight]])
    element.call(brush)

    chart.data.innerTimeWindow
      ? brush.move(
          element,
          chart.data.innerTimeWindow.map(chart.scales.timeScale)
        )
      : brush.move(element, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }
}
