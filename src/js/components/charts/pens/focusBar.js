/* @flow */
import * as d3 from "d3"

import type {Pen} from "../types"
import {getPointAt} from "../getPointAt"
import brim from "../../../brim"

type Props = {
  onFocus: Function
}

export default function({onFocus}: Props): Pen {
  let svg

  function mount(el) {
    svg = el
  }

  function draw(chart) {
    if (chart.state.isDragging) {
      d3.select(svg).on("click.focusbar", null)
    } else {
      d3.select(svg).on("click.focusbar", () => {
        let data = getPointAt(d3.event.offsetX, chart)
        if (data) {
          let {number, unit} = chart.data.interval
          onFocus([
            data.ts,
            brim
              .time(data.ts)
              .add(number, unit)
              .toDate()
          ])
        }
      })
    }
    // Clicking the focus bar off is handled in another pen.
  }

  return {draw, mount}
}
