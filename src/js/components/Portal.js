/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"

type Props = {
  children: *,
  style: Object,
  isOpen: boolean,
  onClose: Function
}

export default class Portal extends React.Component<Props> {
  render() {
    if (!this.props.isOpen) return null
    return ReactDOM.createPortal(
      <div className="portal-overlay" onClick={this.props.onClose}>
        <div className="portal-item" style={this.props.style}>
          {this.props.children}
        </div>
      </div>,
      Doc.id("context-menu-root")
    )
  }
}
