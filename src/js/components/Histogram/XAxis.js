/* @flow */

import * as d3 from "d3"
import type {ChartElement} from "../../models/ChartElements"
import xAxisDrag from "../xAxisDrag"
import * as TimeWindow from "../../lib/TimeWindow"
import {setOuterTimeWindow} from "../../actions/timeWindow"
import {fetchMainSearch} from "../../actions/mainSearch"
import Chart from "../../models/Chart"

export default class XAxis implements ChartElement {
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

    let prevSpan
    const xAxisHandlers = xAxisDrag({
      parent: xAxis.node(),

      onDragStart: () => {
        prevSpan = chart.data.timeWindow
      },

      onDrag: (pos, startPos) => {
        const [from, to] = [pos, startPos].map(num =>
          chart.scales.timeScale.invert(num)
        )
        const diff = TimeWindow.duration([from, to])
        const [nextFrom, nextTo] = TimeWindow.shift(prevSpan, diff)
        chart.update({timeWindow: [nextFrom, nextTo]}).draw()
      },

      onDragEnd: (pos, startPos) => {
        const [from, to] = [pos, startPos].map(chart.scales.timeScale.invert)
        const diff = TimeWindow.duration([from, to])
        this.dispatch(setOuterTimeWindow(TimeWindow.shift(prevSpan, diff)))
        this.dispatch(fetchMainSearch())
      }
    })

    d3.select("body")
      .on("mousemove", xAxisHandlers.mouseMove)
      .on("mouseup", xAxisHandlers.mouseUp)

    xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
      .attr("height", chart.margins.bottom)
      .on("mousedown", xAxisHandlers.mouseDown)

    return xAxis
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
