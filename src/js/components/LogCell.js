/* @flow */

import React from "react"
import DownArrow from "../icons/chevron-bottom-md.svg"
import Tooltip from "./Tooltip"
import * as Time from "../lib/Time"
import * as Doc from "../lib/Doc"
import type {FixedPos} from "../lib/Doc"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import XLogCellActions from "../connectors/XLogCellActions"
import classNames from "classnames"

type Props = {
  field: Field,
  log: Log,
  isScrolling: boolean,
  style?: Object
}

type State = {
  showMenu: boolean,
  hover: boolean,
  menuStyle: FixedPos,
  tooltipStyle: FixedPos
}

export default class LogCell extends React.PureComponent<Props, State> {
  toggleMenu: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      showMenu: false,
      hover: false,
      menuStyle: {top: 0, left: 0},
      tooltipStyle: {top: 0, left: 0}
    }
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
    return <span>{field.value}</span>
  }

  render() {
    const {name, type} = this.props.field
    const cellClass = classNames(`log-cell ${type}`, {
      active: this.state.showMenu,
      hover: !this.props.isScrolling && this.state.hover
    })
    const mouseEnter = e =>
      this.setState({hover: true, tooltipStyle: getTooltipStyle(e)})
    const mouseLeave = _e => this.setState({hover: false})

    return (
      <div
        className={cellClass}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onContextMenu={this.toggleMenu}
        onClick={e => Doc.selectText(e.currentTarget)}
        style={this.props.style}
      >
        {this.renderValue(this.props.field)}

        {this.state.hover && !this.props.isScrolling && (
          <button className="cell-options-button">
            <DownArrow />
          </button>
        )}

        {this.state.hover && !this.props.isScrolling && (
          <Tooltip style={this.state.tooltipStyle}>
            <span className="field-name">{name}</span>
          </Tooltip>
        )}

        {this.state.showMenu && (
          <XLogCellActions
            log={this.props.log}
            field={this.props.field}
            style={this.state.menuStyle}
            onClose={this.toggleMenu}
          />
        )}
      </div>
    )
  }
}

const getTooltipStyle = (e): FixedPos => {
  const {top, left} = e.currentTarget.getBoundingClientRect()
  return {top: top - 21, left}
}
