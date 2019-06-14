/* @flow */
import type {ChartElement} from "../types"
import * as d3 from "d3"

export default function(): ChartElement {
  let yaxis

  return {
    mount: function(svg) {
      yaxis = d3
        .select(svg)
        .append("g")
        .attr("class", "y-axis")
    },

    draw: function(chart) {
      yaxis
        .attr(
          "transform",
          `translate(${chart.margins.left}, ${chart.margins.top})`
        )
        .call(d3.axisLeft(chart.yScale).ticks(3))
    }
  }
}
