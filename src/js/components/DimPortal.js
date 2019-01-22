/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import {CSSTransition} from "react-transition-group"

type Props = {
  children: *,
  style: Object,
  isOpen: boolean,
  onClose: Function
}

export default class DimPortal extends React.Component<Props> {
  render() {
    if (!this.props.isOpen) return null
    return ReactDOM.createPortal(
      <CSSTransition
        in={this.props.isOpen}
        classNames="dim-portal-overlay"
        timeout={{enter: 300}}
        onClick={this.props.onClose}
        appear
      >
        <div className="portal-overlay">
          <div className="portal-item" style={this.props.style}>
            {this.props.children}
          </div>
        </div>
      </CSSTransition>,
      Doc.id("context-menu-root")
    )
  }
}
