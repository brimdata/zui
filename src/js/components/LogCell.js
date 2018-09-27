import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import {ContextMenu, MenuItem} from "./ContextMenu"
import * as Time from "../lib/Time"

export default class LogCell extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {showMenu: false}
    this.include = this.include.bind(this)
    this.exclude = this.exclude.bind(this)
    this.countBy = this.countBy.bind(this)
    this.toggleMenu = e => {
      e.stopPropagation()
      this.setState({showMenu: !this.state.showMenu})
    }
  }

  include(_e) {
    this.props.appendQueryInclude(this.props.name, this.props.value)
    this.props.submitSearchBar()
  }

  exclude(_e) {
    this.props.appendQueryExclude(this.props.name, this.props.value)
    this.props.submitSearchBar()
  }

  countBy() {
    this.props.appendQueryCountBy(this.props.name)
    this.props.submitSearchBar()
  }

  render() {
    const {name, type, value} = this.props
    let cellClass = `log-cell ${type}`
    if (this.state.showMenu) cellClass += " active"

    let valueClass = ""

    if (name === "_path") {
      valueClass += ` ${name} ${value}-bg-color`
    }

    return (
      <div className={cellClass}>
        <span className={valueClass}>{value}</span>
        <span className="field-name">{name}</span>
        <button className="cell-options-button" onClick={this.toggleMenu}>
          <DownArrow />
        </button>
        {this.state.showMenu && (
          <ContextMenu onOutsideClick={this.toggleMenu}>
            <MenuItem onClick={this.exclude}>Filter out these values</MenuItem>
            <MenuItem onClick={this.include}>Only show these values</MenuItem>
            <MenuItem onClick={this.countBy}>Count by this field</MenuItem>
          </ContextMenu>
        )}
      </div>
    )
  }
}

export const TsCell = ({ts, highlight, onClick}) => {
  return (
    <div
      className={`ts-cell ${highlight ? "highlight" : ""}`}
      onClick={onClick}
    >
      <p>
        <span className="date">{Time.format(ts, "MMM DD, YYYY")}</span>
        <span className="time">{Time.format(ts, "HH:mm")}</span>
        <span className="seconds">{Time.format(ts, "ss.SSSS[s]")}</span>
      </p>
    </div>
  )
}
