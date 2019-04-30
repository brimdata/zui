/* @flow */
import * as d3 from "d3"

import {add} from "../../lib/Time"
import {getPointAt} from "../getPointAt"
import Chart from "../Chart"

type Props = {
  onFocus: Function,
  onBlur: Function
}

function findSpan(ts, chart) {
  let {number, unit} = chart.data.interval
  let a = chart.scales.timeScale(ts)
  let b = chart.scales.timeScale(add(ts, number, unit))
  let width = Math.max(Math.floor(b - a) - 2, 2)

  return [a, a + width].map(chart.scales.timeScale.invert)
}

export default function({onFocus, onBlur}: Props) {
  let focused = false

  function mount(chart: Chart) {
    function onClick() {
      let data = getPointAt(d3.event.offsetX, chart)

      if (data && !focused) {
        focused = true
        onFocus(findSpan(data.ts, chart))
      } else {
        focused = false
        onBlur()
      }
    }

    d3.select(chart.svg).on("click", onClick)
  }

  return {mount}
}
