/* @flow */
import * as d3 from "d3"

import {add} from "../../lib/Time"
import {getPointAt} from "../getPointAt"
import Chart from "../Chart"

type Props = {
  onBarClick: Function
}

export default function({onBarClick}: Props) {
  function mount(chart: Chart) {
    function onClick() {
      let data = getPointAt(d3.event.offsetX, chart)
      if (data) {
        const ts = data.ts
        const {number, unit} = chart.data.interval
        const a = chart.scales.timeScale(ts)
        const b = chart.scales.timeScale(add(ts, number, unit))
        let width = Math.max(Math.floor(b - a) - 2, 2)

        const span = [a, a + width].map(chart.scales.timeScale.invert)

        onBarClick && onBarClick(span)
      }
    }

    d3.select(chart.svg).on("click", onClick)
  }

  return {mount}
}
