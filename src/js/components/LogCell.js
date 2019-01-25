/* @flow */

import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import Tooltip from "./Tooltip"
import * as Time from "../lib/Time"
import * as Doc from "../lib/Doc"
import type {FixedPos} from "../lib/Doc"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import classNames from "classnames"
import * as fmt from "../lib/fmt"
import {XLogCellActions} from "./LogCell/LogCellActions"

type Props = {
  field: Field,
  log: Log,
  style?: Object
}

type State = {
  showMenu: boolean,
  hover: boolean,
  menuStyle: FixedPos,
  tooltipStyle: FixedPos
}

export default class LogCell extends React.PureComponent<Props, State> {
  el: ?HTMLElement
  state = {
    showMenu: false,
    hover: false,
    menuStyle: {top: 0, left: 0},
    tooltipStyle: {top: 0, left: 0}
  }

  onRightClick = (e: MouseEvent) => {
    Doc.clearTextSelection()
    e.stopPropagation()
    this.setState({
      hover: true,
      tooltipStyle: getTooltipStyle(this.el),
      showMenu: true,
      menuStyle: {top: e.pageY, left: e.pageX}
    })
  }

  onMenuDismiss = (e: MouseEvent) => {
    Doc.clearTextSelection()
    e.stopPropagation()
    this.setState({
      hover: false,
      showMenu: false
    })
  }

  onMouseEnter = () => {
    this.setState({
      hover: true,
      tooltipStyle: getTooltipStyle(this.el)
    })
  }

  onMouseLeave = () => {
    this.setState({hover: false})
  }

  renderValue(field: Field) {
    if (field.name === "_path")
      return (
        <span className={`${field.name} ${field.value}-bg-color `}>
          {field.value}
        </span>
      )
    if (field instanceof TimeField)
      return (
        <p>
          <span className="date">
            {Time.format(field.toDate(), "MM/DD/YY")}
          </span>
          <span className="time">{Time.format(field.toDate(), "HH:mm")}</span>
          <span className="seconds">
            {Time.format(field.toDate(), "ss.SSSS")}
          </span>
        </p>
      )
    if (field.type === "count") {
      return <span>{fmt.withCommas(field.value)}</span>
    }
    return <span>{field.value}</span>
  }

  render() {
    const {name, type} = this.props.field
    const cellClass = classNames(`log-cell ${type}`, {
      active: this.state.showMenu,
      hover: this.state.hover
    })

    return (
      <div
        className={cellClass}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onRightClick}
        onClick={e => Doc.selectText(e.currentTarget)}
        style={this.props.style}
        ref={r => (this.el = r)}
      >
        {this.renderValue(this.props.field)}

        {this.state.hover && (
          <button className="cell-options-button">
            <DownArrow />
          </button>
        )}

        {this.state.hover && (
          <Tooltip style={this.state.tooltipStyle}>
            <span className="field-name">{name}</span>
          </Tooltip>
        )}

        {this.state.showMenu && (
          <XLogCellActions
            log={this.props.log}
            field={this.props.field}
            style={this.state.menuStyle}
            onClose={this.onMenuDismiss}
          />
        )}
      </div>
    )
  }
}

const getTooltipStyle = (el): FixedPos => {
  if (!el) return {}
  const {top, left} = el.getBoundingClientRect()
  return {top: top - 21, left}
}
