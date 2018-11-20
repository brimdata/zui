import React from "react"

export default class Cell extends React.PureComponent {
  render() {
    return (
      <div style={this.props.style} className="cell">
        <span className="value">{this.props.children}</span>
      </div>
    )
  }
}
