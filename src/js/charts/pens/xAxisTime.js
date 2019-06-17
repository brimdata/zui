/* @flow */

import * as d3 from "d3"

import type {Pen} from "../types"
import type {Span} from "../../BoomClient/types"
import {duration, shift} from "../../lib/TimeWindow"
import {innerWidth} from "../dimens"

type Props = {
  onDragEnd?: (Span) => void
}

export default function({onDragEnd}: Props = {}): Pen {
  let startSpan = null
  let startPos = null
  let xAxis
  let dragArea

  function mount(svg) {
    xAxis = d3
      .select(svg)
      .append("g")
      .attr("class", "x-axis")

    dragArea = xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
  }

  function draw(chart, redraw) {
    xAxis
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.height -
          chart.margins.bottom})`
      )
      .call(d3.axisBottom(chart.xScale))

    dragArea
      .attr("width", innerWidth(chart.width, chart.margins))
      .attr("height", chart.margins.bottom)

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

    if (onDragEnd) {
      d3.select("body")
        .on("mousemove", drag, {passive: true})
        .on("mouseup", dragEnd)
      dragArea.on("mousedown", dragStart)
    }
  }

  return {mount, draw}
}
