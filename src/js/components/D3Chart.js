/* @flow */

import React, {useLayoutEffect, useRef} from "react"
import classNames from "classnames"
import * as d3 from "d3"

import type {ChartElement, HistogramProps} from "../charts/types"
import {useResizeObserver} from "../hooks/useResizeObserver"

type Props = HistogramProps

export default function D3Chart(props: Props) {
  let resize = useResizeObserver()
  let svg = useRef(null)
  let elements = useRef<ChartElement[]>([])
  let {width, height} = resize.rect
  let {right, left, top, bottom} = props.margins
  let {points, span} = props.data
  let innerWidth = Math.max(width - left - right, 0)
  let innerHeight = Math.max(height - top - bottom, 0)

  let chart = {
    svg: svg.current,
    data: props.data,
    state: props.state,
    margins: props.margins,
    dimens: {width, height, innerWidth, innerHeight},
    yScale: d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(points, (d) => d.count) || 0]),
    xScale: d3
      .scaleUtc()
      .range([0, innerWidth])
      .domain(span)
  }

  function mount(chart) {
    elements.current.forEach((el) => {
      el.mount && el.mount(chart, draw)
    })
  }

  function draw(chart) {
    elements.current.forEach((el) => {
      el.draw && el.draw(chart, draw)
    })
  }

  useLayoutEffect(() => {
    if (chart.svg) {
      elements.current = props.buildElements()
      mount(chart)
    }
  }, [chart.svg])

  useLayoutEffect(() => {
    draw(chart)
  })

  return (
    <div className={classNames("chart", props.className)} ref={resize.ref}>
      <svg width={width} height={height} ref={svg} />
    </div>
  )
}
