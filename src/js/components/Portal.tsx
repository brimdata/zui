import {CSSTransition} from "react-transition-group"
import React, {MouseEvent} from "react"
import ReactDOM from "react-dom"

import lib from "../lib"

type Props = {
  children: any
  style: Object
  isOpen: boolean
  onClose: (e: MouseEvent) => void
}

export default class Portal extends React.Component<Props, Object> {
  render() {
    if (!this.props.isOpen) return null
    return ReactDOM.createPortal(
      <div className="portal-overlay" onClick={this.props.onClose}>
        <CSSTransition
          classNames="portal-item"
          in={true}
          timeout={{enter: 150}}
          appear
        >
          <div className="portal-item" style={this.props.style}>
            {this.props.children}
          </div>
        </CSSTransition>
      </div>,
      lib.doc.id("context-menu-root")
    )
  }
}
