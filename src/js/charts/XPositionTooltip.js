/* @flow */
import React from "react"
import {renderToString} from "react-dom/server"
import Chart from "../models/Chart"
import * as d3 from "d3"
import * as Doc from "../lib/Doc"
import Component from "../components/HistogramTooltip"
import * as Time from "../lib/Time"

export default class HistogramTooltip {
  mount(chart: Chart) {
    const tooltip = Doc.id("histogram-tooltip")
    let prevPoint = null

    const hide = () => {
      tooltip.style.opacity = "0"
      prevPoint = null
    }

    const show = function() {
      const [left] = d3.mouse(this)
      const point = getPointAt(left, chart)
      if (point && point.count) {
        positionTooltip(tooltip, this, 30)
        if (prevPoint === point) return
        prevPoint = point
        tooltip.innerHTML = renderToString(
          <Component {...tooltipProps(point)} />
        )
      } else {
        hide()
      }
    }

    d3.select(chart.svg)
      .select(".brush")
      .on("mousedown.tooltip", hide)
      .on("mouseout.tooltip", hide)
      .on("mousemove.tooltip", show)
  }

  draw(_chart: Chart) {}
}

const getPointAt = (left, chart) => {
  const ts = chart.scales.timeScale.invert(left)
  const {number, unit} = chart.data.interval

  for (let index = 0; index < chart.data.data.length; index++) {
    const point = chart.data.data[index]
    const nextTs = Time.add(point.ts, number, unit)

    if (ts >= point.ts && ts < nextTs) return point
  }

  return null
}

const tooltipProps = point => {
  const segments = []
  for (let key in point) {
    if (["ts", "count"].includes(key)) continue
    if (point[key] !== 0) segments.push([key, point[key]])
  }

  return {ts: point.ts, segments}
}

export const positionTooltip = (
  tooltip: HTMLElement,
  parent: HTMLElement,
  padding: number
) => {
  const [left] = d3.mouse(parent)
  const {width} = tooltip.getBoundingClientRect()
  const {width: parentWidth} = parent.getBoundingClientRect()

  d3.select(tooltip)
    .style("left", xPosition(left, width, parentWidth, padding))
    .style("opacity", "1")
}

export const xPosition = (
  left: number,
  width: number,
  parentWidth: number,
  padding: number
) => {
  if (left + width + padding >= parentWidth) {
    return left - width - padding + "px"
  } else {
    return left + padding + "px"
  }
}
