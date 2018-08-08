import React from "react"
import WithOutsideClick from "./WithOutsideClick"

class ContextMenuBase extends React.PureComponent {
  render() {
    return <ul className="context-menu">{this.props.children}</ul>
  }
}

export const MenuItem = ({onClick, children}) => (
  <li onClick={onClick}>{children}</li>
)

export const ContextMenu = WithOutsideClick(ContextMenuBase)
