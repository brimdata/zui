/* @flow */

import {render} from "react-dom"
import React from "react"
import * as d3 from "d3"

import type {Pen} from "../types"
import {getPointAt} from "../getPointAt"

type Args = {
  wrapperClassName: string,
  render: *
}

export default function({wrapperClassName, render: Component}: Args): Pen {
  let div
  let svg
  function hide() {
    div.style.opacity = "0"
  }

  function mount(el) {
    svg = el
    div = document.createElement("div")
    div.classList.add(wrapperClassName)
    if (svg.parentNode) svg.parentNode.appendChild(div)

    d3.select(svg)
      .select(".brush")
      .on("mousedown.tooltip", hide)
  }

  function draw(chart) {
    function show() {
      let [left] = d3.mouse(this)
      let point = getPointAt(left, chart)
      if (point && point.count) {
        positionTooltip(div, this, 30)
        render(<Component {...getProps(point)} />, div)
      } else {
        hide()
      }
    }

    d3.select(svg)
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
