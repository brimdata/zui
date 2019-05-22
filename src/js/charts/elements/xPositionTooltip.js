/* @flow */

import React from "react"
import * as d3 from "d3"
import {render} from "react-dom"

import {getPointAt} from "../getPointAt"

export default function({wrapperClassName, render: Component}) {
  let el

  function mount(chart) {
    el = document.createElement("div")
    el.classList.add(wrapperClassName)
    if (chart.svg.parentNode) chart.svg.parentNode.appendChild(el)
  }

  function draw(chart) {
    function hide() {
      el.style.opacity = "0"
    }

    function show() {
      let [left] = d3.mouse(this)
      let point = getPointAt(left, chart)
      if (point && point.count) {
        positionTooltip(el, this, 30)
        render(<Component {...getProps(point)} />, el)
      } else {
        hide()
      }
    }

    d3.select(chart.svg)
      .select(".brush")
      .on("mousedown.tooltip", hide)
      .on("mouseout.tooltip", hide)
      .on("mousemove.tooltip", show)
  }

  return {mount, draw}
}

const getProps = (point) => {
  const segments = []
  for (let key in point) {
    if (["ts", "count"].includes(key)) continue
    if (point[key] !== 0) segments.push([key, point[key]])
  }

  return {ts: point.ts, segments}
}

export const positionTooltip = (
  el: HTMLElement,
  parent: HTMLElement,
  padding: number
) => {
  const [left] = d3.mouse(parent)
  const {width} = el.getBoundingClientRect()
  const {width: parentWidth} = parent.getBoundingClientRect()

  d3.select(el)
    .style("left", xPosition(left, width, parentWidth, padding))
    .style("opacity", "1")
}

export const xPosition = (
  left: number,
  width: number,
  parentWidth: number,
  padding: number
) => {
  if (left + width + padding >= parentWidth) {
    return left - width - padding + "px"
  } else {
    return left + padding + "px"
  }
}
