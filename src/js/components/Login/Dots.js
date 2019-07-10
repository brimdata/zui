/* @flow */
import React, {useMemo} from "react"
import * as d3 from "d3"

import ChartSVG from "../../charts/ChartSVG"
import Dimens from "../Dimens"
import useConst from "../../hooks/useConst"

function useDots(width, height, data) {
  let pens = useConst([], () => [dotPen()])

  return useMemo(() => {
    let dotSize = 12
    return {
      data,
      width,
      height,
      pens,
      dotSize,
      yScale: d3
        .scaleLinear()
        .domain([d3.max(data, (d) => d), 0])
        .range([dotSize, height - dotSize / 2])
    }
  }, [width, height, data])
}

function dotPen() {
  let group

  function mount(el) {
    group = d3.select(el).append("g")
  }

  function draw(chart) {
    let dots = group.selectAll("circle").data(chart.data)
    let lines = group.selectAll("line").data(chart.data)

    lines
      .enter()
      .append("line")
      .attr("x1", (d, i) => i * chart.dotSize)
      .attr("y1", chart.height)
      .attr("x2", (d, i) => i * chart.dotSize)
      .attr("y2", (d) => chart.yScale(d))

    dots
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d, i) => i * chart.dotSize)
      .attr("cy", (d) => chart.yScale(d))
  }

  return {draw, mount}
}

let endData = "0,0,0,2,0,0,0,5,0,0,0,3,0,0,6,0,11,0,14,0,0,0,7,0,0,0,10,0,8,0,0,0,3,0,6,0,0,0,15,0,8,0,0,5,0,0,0,9,0,0,10,0,0,5,0,0,0,2,0,0,0,7,0,0,0,3,0,0,0,0,1,0,0,0,0,2,0,0,1,0,0,0,0,0,2,0,0,0,5,0,0,0,3,0,0,6,0,11,0,14,0,0,0,7,0,0,0,10,0,8,0,0,0,3,0,6,0,0,0,15,0,8,0,0,5,0,0,0,9,0,0,10,0,0,5,0,0,0,2,0,0,0,7,0,0,0,3,0,0,0,0,1,0,0,0,0,2,0,0,1,0,0"
  .split(",")
  .map((d) => parseInt(d))

export function Dots() {
  return (
    <Dimens
      className="deco-dots"
      render={({width, height}) => {
        return <ChartSVG chart={useDots(width, height, endData)} />
      }}
    />
  )
}
