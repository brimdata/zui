/* @flow */

import * as d3 from "d3"

import type {ChartElement} from "../types"
import type {Span} from "../../BoomClient/types"
import {duration, shift} from "../../lib/TimeWindow"

type Props = {
  onDragEnd?: (Span) => void
}

export default function({onDragEnd}: Props): ChartElement {
  let startSpan = null
  let startPos = null
  let xAxis
  let dragArea

  function mount(chart) {
    xAxis = d3
      .select(chart.svg)
      .append("g")
      .attr("class", "x-axis")

    dragArea = xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
  }

  function draw(chart, redraw) {
    d3.select(chart.svg)
      .select(".x-axis")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.dimens.height -
          chart.margins.bottom})`
      )
      .call(d3.axisBottom(chart.xScale))

    d3.select(chart.svg)
      .select(".x-axis-drag")
      .attr("width", chart.dimens.innerWidth)

    function getXPos() {
      return d3.mouse(xAxis.node())[0]
    }

    function dragStart() {
      startPos = getXPos()
      startSpan = chart.data.span
    }

    function drag() {
      if (startPos === null || startSpan === null) return
      const pos = getXPos()
      const [from, to] = [pos, startPos].map((num) => chart.xScale.invert(num))
      const diff = duration([from, to])
      const [nextFrom, nextTo] = shift(startSpan, diff)
      chart.xScale.domain([nextFrom, nextTo])
      redraw(chart)
    }

    function dragEnd() {
      if (startPos === null || startSpan === null) return
      const pos = getXPos()
      const [from, to] = [pos, startPos].map(chart.xScale.invert)
      const diff = duration([from, to])

      onDragEnd && onDragEnd(shift(startSpan, diff))
      startPos = null
      startSpan = null
    }

    d3.select("body")
      .on("mousemove", drag, {passive: true})
      .on("mouseup", dragEnd)

    dragArea.attr("height", chart.margins.bottom).on("mousedown", dragStart)
  }

  return {mount, draw}
}
