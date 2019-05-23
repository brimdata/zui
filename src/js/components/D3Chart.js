/* @flow */

import React, {useLayoutEffect, useRef} from "react"
import classNames from "classnames"

import type {Chart, ChartElement, ChartSVG, Margins} from "../charts/types"
import {useResizeObserver} from "../hooks/useResizeObserver"

type Props = {|
  className?: string,
  margins: Margins,
  buildElements: () => ChartElement[],
  buildChart: (ChartSVG) => Chart
|}

export default function D3Chart(props: Props) {
  let resize = useResizeObserver()
  let el = useRef(null)
  let elements = useRef<ChartElement[]>([])
  let {width, height} = resize.rect
  let {right, left, top, bottom} = props.margins
  let innerWidth = Math.max(width - left - right, 0)
  let innerHeight = Math.max(height - top - bottom, 0)

  let svg = {
    dimens: {width, height, innerWidth, innerHeight},
    margins: props.margins,
    el: el.current
  }

  let chart = props.buildChart(svg)

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
    if (chart.el) {
      elements.current = props.buildElements()
      mount(chart)
    }
  }, [chart.el])

  useLayoutEffect(() => {
    draw(chart)
  })

  return (
    <div className={classNames("chart", props.className)} ref={resize.ref}>
      <svg width={width} height={height} ref={el} />
    </div>
  )
}
