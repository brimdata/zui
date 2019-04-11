/* @flow */

import * as d3 from "d3"
import type {ChartElement} from "../models/Chart"
import * as TimeWindow from "../lib/TimeWindow"
import {setOuterTimeWindow} from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"
import Chart from "../models/Chart"

export default class TimeSpanXAxis implements ChartElement {
  dispatch: Function

  constructor(dispatch: Function) {
    this.dispatch = dispatch
  }

  mount(chart: Chart) {
    const xAxis = d3
      .select(chart.svg)
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.dimens.height -
          chart.margins.bottom})`
      )

    const parent = xAxis.node()
    let startSpan = null
    let startPos = null

    const dragStart = () => {
      startPos = d3.mouse(parent)[0]
      startSpan = chart.data.timeWindow
    }

    const drag = () => {
      if (startPos === null || startSpan === null) return
      const pos = d3.mouse(parent)[0]
      const [from, to] = [pos, startPos].map((num) =>
        chart.scales.timeScale.invert(num)
      )
      const diff = TimeWindow.duration([from, to])
      const [nextFrom, nextTo] = TimeWindow.shift(startSpan, diff)
      chart.update({timeWindow: [nextFrom, nextTo]})
      chart.draw()
    }

    const dragEnd = () => {
      if (startPos === null || startSpan === null) return
      const pos = d3.mouse(parent)[0]
      const [from, to] = [pos, startPos].map(chart.scales.timeScale.invert)
      const diff = TimeWindow.duration([from, to])
      this.dispatch(setOuterTimeWindow(TimeWindow.shift(startSpan, diff)))
      this.dispatch(fetchMainSearch())
      startPos = null
      startSpan = null
    }

    d3.select("body")
      .on("mousemove", drag)
      .on("mouseup", dragEnd)

    xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
      .attr("height", chart.margins.bottom)
      .on("mousedown", dragStart)
  }

  draw(chart: Chart) {
    d3.select(chart.svg)
      .select(".x-axis")
      .call(d3.axisBottom(chart.scales.timeScale))

    d3.select(chart.svg)
      .select(".x-axis-drag")
      .attr("width", chart.dimens.innerWidth)
  }
}
