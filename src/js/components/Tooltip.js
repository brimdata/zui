/* @flow */

import React, {useState} from "react"
import ReactDOM from "react-dom"

import lib from "../lib"
import {getTooltipStyle} from "../lib/MenuStyler"

type Props = {
  style: Object,
  children: any
}

export default class Tooltip extends React.Component<Props> {
  let [hover, setHover] = useState(false)
  let [tooltipStyle, setTooltipStyle] = useState({})

function handleMouseEnter(e) {
  setHover(true)
  setTooltipStyle(getTooltipStyle(e.currentTarget))
}

function handleMouseLeave() {
  setHover(false)
}

  render() {
    return ReactDOM.createPortal(
      <div className="tool-tip" style={this.props.style}>
        {this.props.children}
      </div>,
      lib.doc.id("tooltip-root")
    )
  }
}
