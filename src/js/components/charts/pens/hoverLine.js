/* @flow */

import * as d3 from "d3"

import type {Pen} from "../types"
import {innerHeight} from "../dimens"

export default function(): Pen {
  let line
  let overflow = 10
  let svg

  function mount(el) {
    svg = el
    line = d3
      .select(svg)
      .insert("rect")
      .attr("class", "hover-line")
      .style("pointer-events", "none")
      .style("display", "none")
      .attr("width", "1px")
  }

  function draw(chart) {
    line.attr("height", innerHeight(chart.height, chart.margins) + overflow * 2)

    d3.select(svg)
      .on("mouseout.hoverline", function() {
        line.style("display", "none")
      })
      .on("mousemove.hoverline", function() {
        const [x] = d3.mouse(this)
        if (x < chart.margins.left) {
          line.style("display", "none")
        } else {
          line
            .attr(
              "transform",
              `translate(${x}, ${chart.margins.top - overflow})`
            )
            .style("display", "block")
        }
      })
      .on("mousedown.hoverline", function() {
        line.style("display", "none")
      })
  }

  return {mount, draw}
}
