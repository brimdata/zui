/* @flow */
import {render} from "react-dom"

export default function loading(renderComponent) {
  let root

  function mount(chart) {
    root = document.createElement("div")
    if (chart.svg.parentNode) {
      chart.svg.parentNode.appendChild(root)
    }
  }

  function draw(chart) {
    render(renderComponent(chart), root)
  }

  return {draw, mount}
}
