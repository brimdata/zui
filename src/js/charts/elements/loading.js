/* @flow */
import {render} from "react-dom"
import React from "react"

import LoadingMessage from "../../components/LoadingMessage"

export default function loading() {
  let el

  function mount(chart) {
    el = document.createElement("div")
    if (chart.svg.parentNode) {
      chart.svg.parentNode.appendChild(el)
    }
  }

  function draw(chart) {
    render(
      <LoadingMessage show={chart.state.isFetching} message="chart loading" />,
      el
    )
  }
  return {draw, mount}
}
