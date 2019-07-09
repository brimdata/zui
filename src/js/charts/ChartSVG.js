/* @flow */
import React, {useLayoutEffect, useRef} from "react"

import type {Pen} from "./types"

type Props = {
  chart: {
    pens: Pen[],
    width: number,
    height: number
  }
}

const ChartSVG = React.memo<Props>(function ChartSVG({chart}: Props) {
  let el = useRef(null)

  function mount() {
    let node = el.current
    if (node) chart.pens.forEach((pen) => pen.mount(node))
  }

  function draw() {
    chart.pens.forEach((pen) => pen.draw(chart, draw))
  }

  useLayoutEffect(mount, [el.current])
  useLayoutEffect(draw)

  return <svg width={chart.width} height={chart.height} ref={el} />
})

export default ChartSVG
