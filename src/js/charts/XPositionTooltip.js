/* @flow */
import React from "react"
import {renderToString} from "react-dom/server"
import Chart from "../models/Chart"
import * as d3 from "d3"
import * as Doc from "../lib/Doc"
import Component from "../components/HistogramTooltip"

export default class HistogramTooltip {
  mount(chart: Chart) {
    const tooltip = Doc.id("histogram-tooltip")
    let prevDataIndex = null

    d3.select(chart.svg)
      .select(".brush")
      .on("mousedown", () => {
        tooltip.style.opacity = "0"
      })
      .on("mouseout", () => {
        tooltip.style.opacity = "0"
        prevDataIndex = null
      })
      .on("mousemove", function() {
        const [left] = d3.mouse(this)
        const ts = chart.scales.timeScale.invert(left)
        const bisect = d3.bisector(d => d.ts).left
        const index = bisect(chart.data.data, ts) - 1
        const point = chart.data.data[index]
        const segments = []
        for (let key in point) {
          if (["ts", "count"].includes(key)) continue
          if (point[key] !== 0) segments.push([key, point[key]])
        }

        if (!segments.length) return

        requestAnimationFrame(() => {
          tooltip.style.display = "block"
          tooltip.style.opacity = "1"
          tooltip.style.left = left + 30 + "px"
        })

        if (prevDataIndex === index) return

        prevDataIndex = index
        tooltip.innerHTML = renderToString(
          <Component
            style={{left}}
            segments={segments}
            ts={chart.data.data[index].ts}
          />
        )
      })
  }

  draw(_chart: Chart) {}
}
