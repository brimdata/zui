/* @flow */

import * as d3 from "d3"

import type {Pen} from "../types"
import {innerWidth} from "../dimens"

export default function(): Pen {
  let yaxis

  function mount(svg) {
    yaxis = d3
      .select(svg)
      .append("g")
      .attr("class", "y-axis-single-tick")
  }

  function draw(chart) {
    if (chart.data.points.length === 0) {
      yaxis.style("opacity", "0")
      return
    }

    yaxis
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
      .style("opacity", "1")
      .call(
        d3
          .axisRight(chart.yScale)
          .ticks(1)
          .tickValues(chart.yScale.domain().map(d3.format("d")))
      )
      .selectAll(".tick")
      .each(function() {
        let {width, height, x, y} = this.querySelector("text").getBBox()
        width += x + 4
        height += 4
        y -= 2

        d3.select(this)
          .selectAll("polygon")
          .remove()

        d3.select(this)
          .selectAll("line")
          .attr("x2", innerWidth(chart.width, chart.margins))

        d3.select(this)
          .select("text")
          .attr("transform", "translate(6)")

        d3.select(this)
          .insert("polygon", "text")
          .attr("class", "tick-bg")
          .attr("transform", `translate(6, ${y})`)
          .attr(
            "points",
            [[5, 0], [width, 0], [width, height], [5, height]]
              .map((a) => a.join(","))
              .join(" ")
          )
      })
  }

  return {mount, draw}
}
