import React from "react"
import XFieldActionsPopup from "../connectors/XFieldActionsPopup"
import doc from "../doc"

export default class ActionableField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showContextMenu: false,
      contextMenuStyle: {top: "0px", left: "0px"}
    }

    this.setRef = r => (this.node = r)
    this.onInsideClick = this.onInsideClick.bind(this)
    this.onBodyClick = this.onBodyClick.bind(this)
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.onBodyClick, false)
  }

  onBodyClick(e) {
    if (this.node && this.node.contains(e.target)) return
    this.setState({showContextMenu: false})
    document.body.removeEventListener("click", this.onBodyClick, false)
  }

  onInsideClick(e) {
    document.body.addEventListener("click", this.onBodyClick, false)

    const {left, top} = doc.offset(this.node)

    this.setState({
      showContextMenu: true,
      contextMenuStyle: {
        top: e.pageY - top, // so we don't immediately trigger a hover state
        left: e.pageX - left
      }
    })
  }

  contextMenu() {
    return (
      <XFieldActionsPopup
        field={this.props.field}
        style={this.state.contextMenuStyle}
      />
    )
  }

  render() {
    return (
      <span
        ref={this.setRef}
        onClick={this.onInsideClick}
        style={{position: "relative", cursor: "pointer"}}
      >
        {this.props.children}
        {this.state.showContextMenu ? this.contextMenu() : null}
      </span>
    )
  }
}
