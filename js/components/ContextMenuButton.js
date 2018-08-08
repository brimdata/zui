import React from "react"

export default class ContextMenuButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="context-menu-button" onClick={this.props.onClick}>
        <div className="dots">•••</div>
      </div>
    )
  }
}
