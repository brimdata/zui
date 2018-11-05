/* @flow */

import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import {ContextMenu, MenuItem} from "./ContextMenu"
import Tooltip from "./Tooltip"
import * as Time from "../lib/Time"
import * as Doc from "../lib/Doc"
import type {FixedPos} from "../lib/Doc"

type Props = {
  appendQueryInclude: Function,
  submitSearchBar: Function,
  appendQueryExclude: Function,
  appendQueryCountBy: Function,
  name: string,
  value: string,
  type: string,
  isScrolling: boolean
}

type State = {
  showMenu: boolean,
  hover: boolean,
  menuStyle: FixedPos,
  tooltipStyle: FixedPos
}

export default class LogCell extends React.PureComponent<Props, State> {
  include: Function
  exclude: Function
  countBy: Function
  toggleMenu: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      showMenu: false,
      hover: false,
      menuStyle: {top: 0, left: 0},
      tooltipStyle: {top: 0, left: 0}
    }
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

  include(e: Event) {
    e.stopPropagation()
    this.props.appendQueryInclude(
      this.props.name,
      escapeSpaces(this.props.value)
    )
    this.props.submitSearchBar()
  }

  exclude(e: Event) {
    e.stopPropagation()
    this.props.appendQueryExclude(
      this.props.name,
      escapeSpaces(this.props.value)
    )
    this.props.submitSearchBar()
  }

  countBy(e: Event) {
    e.stopPropagation()
    this.props.appendQueryCountBy(this.props.name)
    this.props.submitSearchBar()
  }

  render() {
    const {name, type, value} = this.props
    let cellClass = `log-cell ${type}`
    if (this.state.showMenu) cellClass += " active"
    if (!this.props.isScrolling && this.state.hover) cellClass += " hover"
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

type TsCellArgs = {ts: Date, highlight: boolean, onClick: Function}
export const TsCell = ({ts, highlight, onClick}: TsCellArgs) => {
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

const getTooltipStyle = (e): FixedPos => {
  const {top, left} = e.currentTarget.getBoundingClientRect()
  return {top: top - 21, left}
}

const escapeSpaces = value => {
  if (/\s+/.test(value)) {
    return `"${value}"`
  } else {
    return value
  }
}
