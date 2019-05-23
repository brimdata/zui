/* @flow */
import type {ChartElement} from "../types"
import * as d3 from "d3"

export default function(): ChartElement {
  return {
    mount: function(chart) {
      d3.select(chart.el)
        .append("g")
        .attr("class", "y-axis")
    },
    draw: function(chart) {
      d3.select(chart.el)
        .select(".y-axis")
        .attr(
          "transform",
          `translate(${chart.margins.left}, ${chart.margins.top})`
        )
        .call(d3.axisLeft(chart.yScale).ticks(3))
    }
  }
}
