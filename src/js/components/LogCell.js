import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import {ContextMenu, MenuItem} from "./ContextMenu"
import Tooltip from "./Tooltip"
import * as Time from "../lib/Time"
import * as Doc from "../lib/Doc"

export default class LogCell extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {showMenu: false}
    this.include = this.include.bind(this)
    this.exclude = this.exclude.bind(this)
    this.countBy = this.countBy.bind(this)
    this.toggleMenu = e => {
      Doc.clearTextSelection()
      e.stopPropagation()
      this.setState({
        hover: !this.state.showMenu,
        showMenu: !this.state.showMenu,
        menuStyle: {top: e.pageY, left: e.pageX}
      })
    }
  }

  include(e) {
    e.stopPropagation()
    this.props.appendQueryInclude(this.props.name, this.props.value)
    this.props.submitSearchBar()
  }

  exclude(e) {
    e.stopPropagation()
    this.props.appendQueryExclude(this.props.name, this.props.value)
    this.props.submitSearchBar()
  }

  countBy(e) {
    e.stopPropagation()
    this.props.appendQueryCountBy(this.props.name)
    this.props.submitSearchBar()
  }

  render() {
    const {name, type, value} = this.props
    let cellClass = `log-cell ${type}`
    if (this.state.showMenu) cellClass += " active"
    if (!this.state.isScrolling && this.state.hover) cellClass += " hover"
    let valueClass = ""

    if (name === "_path") {
      valueClass += ` ${name} ${value}-bg-color`
    }

    const mouseEnter = e => {
      this.setState({hover: true, tooltipStyle: getTooltipStyle(e)})
    }

    const mouseLeave = _e => {
      this.setState({hover: false})
    }

    return (
      <div
        className={cellClass}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onContextMenu={this.toggleMenu}
        onClick={e => Doc.selectText(e.currentTarget)}
      >
        <span className={valueClass}>{value}</span>

        {this.state.hover &&
          !this.props.isScrolling && (
            <button className="cell-options-button">
              <DownArrow />
            </button>
          )}

        {this.state.hover &&
          !this.props.isScrolling && (
            <Tooltip style={this.state.tooltipStyle}>
              <span className="field-name">{name}</span>
            </Tooltip>
          )}

        {this.state.showMenu && (
          <ContextMenu
            onOutsideClick={this.toggleMenu}
            style={this.state.menuStyle}
          >
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

const getTooltipStyle = e => {
  const {top, left} = e.currentTarget.getBoundingClientRect()
  return {top: top - 21, left}
}
