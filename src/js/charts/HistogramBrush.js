/* @flow */

import * as d3 from "d3"
import React from "react"
import type {ChartElement} from "../models/Chart"
import Chart from "../models/Chart"
import isEqual from "lodash/isEqual"
import {setInnerTimeWindow, setOuterTimeWindow} from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"
import * as Doc from "../lib/Doc"
import {renderToString} from "react-dom/server"
import HistogramTooltip from "../components/HistogramTooltip"

export default class HistogramBrush implements ChartElement {
  dispatch: Function

  constructor(dispatch: Function) {
    this.dispatch = dispatch
  }

  mount(chart: Chart) {
    d3.select(chart.svg)
      .append("g")
      .attr("class", "brush")
      .attr("transform", `translate(${chart.margins.left}, 0)`)
  }

  draw(chart: Chart) {
    let prevSelection = null
    let justClicked = false
    let timeout
    let prevDataIndex = null

    const dispatch = this.dispatch
    const tooltip = Doc.id("histogram-tooltip")

    d3.select(chart.svg)
      .on("mouseout", () => {
        tooltip.style.opacity = "0"
        prevDataIndex = null
      })
      .on("mousemove", function() {
        const [left] = d3.mouse(this)
        const ts = chart.scales.timeScale.invert(left)
        const bisect = d3.bisector(d => d.ts).left
        const index = bisect(chart.data.data, ts)

        const segments = []
        for (let key in chart.data.data[index]) {
          if (["ts", "count"].includes(key)) continue
          const value = chart.data.data[index][key]
          if (value !== 0) segments.push([key, value])
        }
        if (!segments.length) return
        requestAnimationFrame(() => {
          tooltip.style.opacity = "1"
          tooltip.style.left = left + 30 + "px"
        })

        if (prevDataIndex === index) {
          return
        }

        prevDataIndex = index
        tooltip.innerHTML = renderToString(
          <HistogramTooltip
            style={{left}}
            segments={segments}
            ts={chart.data.data[index].ts}
          />
        )
      })

    function onBrushStart() {
      tooltip.style.opacity = "0"
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
      .extent([
        [0, 0],
        [chart.dimens.innerWidth, chart.dimens.innerHeight + chart.margins.top]
      ])
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
