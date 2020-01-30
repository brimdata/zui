/* @flow */

import * as d3 from "d3"

import type {Pen} from "../types"
import {d3ElementAttr, itestLocator} from "../../../test/integration"
import {innerHeight} from "../dimens"
import brim from "../../../brim"

export default function(): Pen {
  let chartG
  function mount(svg) {
    chartG = d3
      .select(svg)
      .append("g")
      .attr("class", "chart")
      .attr(itestLocator, d3ElementAttr("histogram"))
  }

  function draw(chart) {
    const series = d3.stack().keys(chart.data.keys)(chart.data.points)
    const barGroups = chartG
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
      .selectAll("g")
      .data(series, (d) => d.key)

    const t = d3.transition().duration(100)
    let innerH = innerHeight(chart.height, chart.margins)
    barGroups
      .exit()
      .selectAll("rect")
      .remove()

    const bars = barGroups
      .enter()
      .append("g")
      .attr("class", (d) => `${d.key}-bg-color`)
      .merge(barGroups)
      .selectAll("rect")
      .data((d) => d)

    bars
      .exit()
      .attr("opacity", 1)
      .attr("y", innerH)
      .attr("opacity", 0)
      .remove()

    let width = 0
    if (chart.data.points[0]) {
      const ts = chart.data.points[0].ts
      const {number, unit} = chart.data.interval
      const a = chart.xScale(ts)
      const b = chart.xScale(
        brim
          .time(ts)
          .add(number, unit)
          .toDate()
      )
      width = Math.max(Math.floor(b - a), 1)
    }

    function clampWidth(d) {
      // Keep the chart from overflowing the x axis
      let x = chart.xScale(d.data.ts)
      if (x > 0) return width
      else return Math.max(0, width + x)
    }

    bars
      .enter()
      .append("rect")
      .attr("y", innerH)
      .attr("height", 0)
      .merge(bars)
      .attr("width", clampWidth)
      .attr("x", (d) => Math.max(0, chart.xScale(d.data.ts)))
      .transition(t)
      .attr("y", (d) => chart.yScale(d[1]))
      .attr("height", (d) => chart.yScale(d[0]) - chart.yScale(d[1]))
  }

  return {mount, draw}
}
