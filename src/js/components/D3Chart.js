/* @flow */

import React, {useLayoutEffect, useRef} from "react"
import classNames from "classnames"

import type {Chart, ChartElement, ChartSVG, Margins} from "../charts/types"
import {useResizeObserver} from "../hooks/useResizeObserver"

type Props = {|
  className?: string,
  margins: Margins,
  buildChart: (ChartSVG) => Chart
|}

export default function D3Chart(props: Props) {
  let resize = useResizeObserver()
  let el = useRef(null)
  let {width, height} = resize.rect
  let {right, left, top, bottom} = props.margins

  let chart = props.buildChart({
    dimens: {width, height},
    margins: props.margins,
    el: el.current
  })

  function drawElements(chart) {
    chart.elements.forEach(({draw}) => draw && draw(chart, drawElements))
  }

  useLayoutEffect(() => {
    let svg = el.current
    if (svg) {
      chart.elements.forEach(({mount}) => mount && mount(svg))
    }
  }, [chart.el])

  useLayoutEffect(() => {
    drawElements(chart)
  })

  return (
    <div className={classNames("chart", props.className)} ref={resize.ref}>
      <svg width={width} height={height} ref={el} />
    </div>
  )
}
