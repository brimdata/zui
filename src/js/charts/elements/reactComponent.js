/* @flow */
import {render} from "react-dom"

import type {ChartElement} from "../../components/Charts/types"

export default function reactComponent(renderComponent: *): ChartElement {
  let root

  function mount({svg}) {
    if (!svg) return
    root = document.createElement("div")
    if (svg.parentNode) {
      svg.parentNode.appendChild(root)
    }
  }

  function draw(chart) {
    render(renderComponent(chart), root)
  }

  return {draw, mount}
}
