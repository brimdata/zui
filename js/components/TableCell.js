import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import WithOutsideClick from "./WithOutsideClick"
import FieldFilter from "../models/FieldFilter"
import classNames from "classnames"

export default class TableCell extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {showMenu: false}
    this.include = this.include.bind(this)
    this.exclude = this.exclude.bind(this)
    this.toggleMenu = () => this.setState({showMenu: !this.state.showMenu})
  }

  include(_e) {
    const filter = new FieldFilter({
      field: this.props.field,
      operator: "="
    })

    this.props.appendToQuery(filter.toProgramFragment())
  }

  exclude(_e) {
    const filter = new FieldFilter({
      field: this.props.field,
      operator: "!="
    })

    this.props.appendToQuery(filter.toProgramFragment())
  }

  render() {
    const {field} = this.props
    const className = classNames("cell", field.type, field.name, {
      active: this.state.showMenu
    })

    return (
      <div className={className}>
        <p
          className={classNames({
            [`${field.value}-bg-color`]: field.name === "_path"
          })}
        >
          {field.toString()}
        </p>
        <span className="field-name">{field.name}</span>
        <button className="cell-options-button" onClick={this.toggleMenu}>
          <DownArrow />
        </button>

        {this.state.showMenu && (
          <ContextMenu onOutsideClick={this.toggleMenu}>
            <MenuItem onClick={this.exclude}>Filter out these values</MenuItem>
            <MenuItem onClick={this.include}>Only show these values</MenuItem>
          </ContextMenu>
        )}
      </div>
    )
  }
}

class ContextMenuBase extends React.PureComponent {
  render() {
    return <ul className="context-menu">{this.props.children}</ul>
  }
}

const MenuItem = props => <li onClick={props.onClick}>{props.children}</li>

const ContextMenu = WithOutsideClick(ContextMenuBase)
