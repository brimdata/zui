/* @flow */

import {isEqual} from "lodash"
import * as d3 from "d3"

import type {Span} from "../../BoomClient/types"
import Chart from "../Chart"

type Props = {
  onSelection?: (span: Span) => void,
  onSelectionClear?: () => void,
  onSelectionDoubleClick?: (span: Span) => void,
  onSelectionClick: (span: Span) => void
}

export default function(props: Props = {}) {
  const {
    onSelection,
    onSelectionClear,
    onSelectionDoubleClick,
    onSelectionClick
  } = props

  function mount(chart: Chart) {
    d3.select(chart.svg)
      .append("g")
      .attr("class", "brush")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
  }

  function draw(chart: Chart) {
    let prevSelection = null
    let justClicked = false
    let timeout

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
        if (chart.props.innerTimeWindow) onSelectionClear && onSelectionClear()
        return
      }

      if (!isEqual(selection, prevSelection)) {
        onSelection && onSelection(selection.map(chart.scales.timeScale.invert))
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
        onSelectionClick(selection.map(chart.scales.timeScale.invert))
        return
      }
      if (doubleClickedSelection) {
        onSelectionDoubleClick &&
          onSelectionDoubleClick(selection.map(chart.scales.timeScale.invert))
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

    chart.props.innerTimeWindow
      ? brush.move(
          element,
          chart.props.innerTimeWindow.map(chart.scales.timeScale)
        )
      : brush.move(element, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }

  return {mount, draw}
}
