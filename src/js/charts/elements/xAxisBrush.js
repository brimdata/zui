/* @flow */

import {isEqual} from "lodash"
import * as d3 from "d3"

import type {Span} from "../../BoomClient/types"

type Props = {
  onSelection: (span: Span) => void,
  onSelectionClear: () => void,
  onSelectionClick: (span: Span) => void
}

export default function(props: Props = {}) {
  const {onSelection, onSelectionClear, onSelectionClick} = props

  function mount(chart) {
    d3.select(chart.svg)
      .append("g")
      .attr("class", "brush")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
  }

  function draw(chart) {
    let prevSelection = null

    function onBrushStart() {
      prevSelection = d3.brushSelection(
        d3
          .select(chart.svg)
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
        if (chart.selection) onSelectionClear && onSelectionClear()
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

    const element = d3.select(".brush")
    const brush = d3
      .brushX()
      .extent([[0, 0], [chart.dimens.innerWidth, chart.dimens.innerHeight]])

    element.call(brush)
    chart.selection
      ? brush.move(element, chart.selection.map(chart.xScale))
      : brush.move(element, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }

  return {mount, draw}
}
