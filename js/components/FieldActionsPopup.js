import React from "react"
import FieldFilter from "../models/FieldFilter"

export default class FieldActionsPopup extends React.Component {
  constructor(props) {
    super(props)
    this.excludeClicked = this.excludeClicked.bind(this)
    this.appendClicked = this.appendClicked.bind(this)
  }

  appendClicked(_e) {
    const filter = new FieldFilter({
      field: this.props.field,
      operator: "="
    })

    this.props.appendMainSearchQueryProgram(filter.toProgramFragment())
  }

  excludeClicked(_e) {
    const filter = new FieldFilter({
      field: this.props.field,
      operator: "!="
    })

    this.props.appendMainSearchQueryProgram(filter.toProgramFragment())
  }

  render() {
    if (!this.props.field) return null

    return (
      <div className="context-menu-overlay" onClick={this.props.onDismiss}>
        <div
          ref={r => (this.node = r)}
          className="field-actions-popup context-menu"
          style={this.props.style}
        >
          <a onClick={this.appendClicked}>Only show these values</a>
          <a onClick={this.excludeClicked}>Filter out these values</a>
        </div>
      </div>
    )
  }
}
