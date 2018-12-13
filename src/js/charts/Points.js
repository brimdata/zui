/* @flow */

import * as d3 from "d3"
import type {ChartElement} from "../models/ChartElements"
import Chart from "../models/Chart"

export default class Points implements ChartElement {
  dispatch: Function

  constructor(dispatch: Function) {
    this.dispatch = dispatch
  }

  mount(chart: Chart) {
    d3.select(chart.svg)
      .append("g")
      .attr("class", "chart")
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
  }

  draw(chart: Chart) {
    const series = d3.stack().keys(chart.data.keys)(chart.data.data)
    const barGroups = d3
      .select(chart.svg)
      .select(".chart")
      .selectAll("g")
      .data(series, d => d.key)
    const t = d3.transition().duration(100)

    barGroups
      .exit()
      .selectAll("rect")
      .remove()

    const bars = barGroups
      .enter()
      .append("g")
      .attr("class", d => `${d.key}-bg-color`)
      .merge(barGroups)
      .selectAll("rect")
      .data(d => d)

    bars
      .exit()
      .attr("opacity", 1)
      .attr("y", chart.dimens.innerHeight)
      .attr("opacity", 0)
      .remove()

    bars
      .enter()
      .append("rect")
      .attr("y", chart.dimens.innerHeight)
      .attr("height", 0)
      .merge(bars)
      .attr("width", chart.scales.xScale.bandwidth())
      .attr("x", d => chart.scales.timeScale(d.data.ts))
      .transition(t)
      .attr("y", d => chart.scales.yScale(d[1]))
      .attr(
        "height",
        d => chart.scales.yScale(d[0]) - chart.scales.yScale(d[1])
      )
  }
}
