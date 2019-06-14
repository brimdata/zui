/* @flow */

import {isEqual} from "lodash"
import * as d3 from "d3"

import type {ChartElement} from "../types"
import type {Span} from "../../BoomClient/types"
import {innerHeight, innerWidth} from "../dimens"

type Props = {
  onSelection: (span: Span) => void,
  onSelectionClear: () => void,
  onSelectionClick: (span: Span) => void
}

export default function(props: Props = {}): ChartElement {
  const {onSelection, onSelectionClear, onSelectionClick} = props
  let brushEl

  function mount(svg) {
    brushEl = d3
      .select(svg)
      .append("g")
      .attr("class", "brush")
  }

  function draw(chart) {
    let prevSelection = null

    function onBrushStart() {
      prevSelection = d3.brushSelection(
        d3
          .select(chart.el)
          .select(".brush")
          .node()
      )
    }

    function onBrushEnd() {
      let {selection, sourceEvent} = d3.event

      if (!sourceEvent) {
        return
      }

      if (!selection) {
        if (chart.state.selection) onSelectionClear && onSelectionClear()
        return
      }

      if (!isEqual(selection, prevSelection)) {
        onSelection && onSelection(selection.map(chart.xScale.invert))
        return
      }

      let [start, end] = selection
      let [x] = d3.mouse(this)
      if (x >= start && x <= end) {
        onSelectionClick(selection.map(chart.xScale.invert))
        return
      }
    }

    brushEl
      .select(".brush")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
    const brush = d3
      .brushX()
      .extent([[0, 0], [innerWidth(chart), innerHeight(chart)]])

    brushEl.call(brush)
    chart.state.selection
      ? brush.move(brushEl, chart.state.selection.map(chart.xScale))
      : brush.move(brushEl, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }

  return {mount, draw}
}
