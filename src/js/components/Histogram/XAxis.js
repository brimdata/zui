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

  mount(chart: Chart, svg: HTMLElement) {
    const xAxis = d3
      .select(svg)
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.dimens.height -
          chart.margins.bottom})`
      )

    const xAxisHandlers = xAxisDrag({
      parent: xAxis.node(),
      onDrag: this.onDrag.bind(chart),
      onDragEnd: this.onDragEnd.bind(this)
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

  draw(chart: Chart, svg: HTMLElement) {
    d3.select(svg)
      .select(".x-axis")
      .call(d3.axisBottom(chart.scales.timeScale))

    d3.select(svg)
      .select(".x-axis-drag")
      .attr("width", chart.dimens.innerWidth)
  }

  onDrag(chart: Chart, pos: number, startPos: number) {
    const [from, to] = [pos, startPos].map(num =>
      chart.scales.timeScale.invert(num)
    )
    const diff = TimeWindow.duration([from, to])
    const [nextFrom, nextTo] = TimeWindow.shift(chart.scales.timeWindow, diff)
    console.log("Finish me", [nextFrom, nextTo])
  }

  onDragEnd(chart: Chart, pos: number, startPos: number) {
    const [from, to] = [pos, startPos].map(chart.scales.timeScale.invert)
    const diff = TimeWindow.duration([from, to])
    this.dispatch(
      setOuterTimeWindow(TimeWindow.shift(chart.data.timeWindow, diff))
    )
    this.dispatch(fetchMainSearch())
  }
}
