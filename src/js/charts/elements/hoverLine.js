/* @flow */

import * as d3 from "d3"

import Chart from "../Chart"

export default function() {
  function mount(chart: Chart) {
    const overflow = 10
    const line = d3
      .select(chart.svg)
      .insert("rect")
      .attr("class", "hover-line")
      .style("pointer-events", "none")
      .style("display", "none")
      .attr("width", "1px")
      .attr("height", chart.dimens.innerHeight + overflow * 2)

    d3.select(chart.svg)
      .select(".brush")
      .on("mouseout.hoverline", function() {
        line.style("display", "none")
      })
      .on("mousemove.hoverline", function() {
        const [x] = d3.mouse(this)
        line
          .attr("transform", `translate(${x}, ${chart.margins.top - overflow})`)
          .style("display", "block")
      })
      .on("mousedown.hoverline", function() {
        line.style("display", "none")
      })
  }

  return {mount}
}
