/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"

type Props = {
  children: any,
  style: {top: number, left: number},
  onOutsideClick: Function
}

export class ContextMenu extends React.PureComponent<Props> {
  render() {
    return ReactDOM.createPortal(
      <div className="context-menu-overlay" onClick={this.props.onOutsideClick}>
        <ul className="context-menu" style={this.props.style}>
          {this.props.children}
        </ul>
      </div>,
      Doc.id("context-menu-root")
    )
  }
}

type ItemProps = {onClick: Function, children: any}
export const MenuItem = ({onClick, children}: ItemProps) => (
  <li onClick={onClick}>{children}</li>
)
