/* @flow */

import * as d3 from "d3"

import type {Span} from "../../BoomClient/types"
import {duration, shift} from "../../lib/TimeWindow"
import Chart from "../Chart"

type Props = {
  onDragEnd?: (Span) => void
}

export default function({onDragEnd}: Props) {
  function mount(chart: Chart) {
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
      const diff = duration([from, to])
      const [nextFrom, nextTo] = shift(startSpan, diff)
      chart.update({timeWindow: [nextFrom, nextTo]})
      chart.draw()
    }

    const dragEnd = () => {
      if (startPos === null || startSpan === null) return
      const pos = d3.mouse(parent)[0]
      const [from, to] = [pos, startPos].map(chart.scales.timeScale.invert)
      const diff = duration([from, to])
      onDragEnd && onDragEnd(shift(startSpan, diff))
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

  function draw(chart: Chart) {
    d3.select(chart.svg)
      .select(".x-axis")
      .call(d3.axisBottom(chart.scales.timeScale))

    d3.select(chart.svg)
      .select(".x-axis-drag")
      .attr("width", chart.dimens.innerWidth)
  }

  return {mount, draw}
}
