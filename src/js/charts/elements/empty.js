/* @flow */
import {render} from "react-dom"
import React from "react"
import classNames from "classnames"

import {Fieldset} from "../../components/Typography"

export default function empty() {
  let el

  function mount(chart) {
    el = document.createElement("div")
    if (chart.svg.parentNode) {
      chart.svg.parentNode.appendChild(el)
    }
  }

  function draw(chart) {
    console.log(!chart.state.isFetching && chart.state.isEmpty)
    render(
      <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />,
      el
    )
  }

  return {mount, draw}
}

function EmptyMessage(show) {
  return (
    <Fieldset className={classNames("no-chart-data", {visible: show})}>
      No Chart Data
    </Fieldset>
  )
}
