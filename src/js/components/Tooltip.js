/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"

type Props = {
  style: {top: number, left: number},
  children: any
}

export default class Tooltip extends React.Component<Props> {
  render() {
    return ReactDOM.createPortal(
      <div className="tool-tip" style={this.props.style}>
        {this.props.children}
      </div>,
      Doc.id("tooltip-root")
    )
  }
}
