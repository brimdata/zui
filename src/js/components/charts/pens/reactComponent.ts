import {createRoot} from "react-dom/client"

import {Pen} from "../types"

export default function reactComponent(renderComponent: any): Pen {
  let root

  function mount(el) {
    const container = document.createElement("div")
    root = createRoot(container)
    if (el.parentNode) {
      el.parentNode.appendChild(container)
    }
  }

  function draw(chart) {
    root.render(renderComponent(chart))
  }

  return {draw, mount}
}
