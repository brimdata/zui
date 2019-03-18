/* @flow */

import React from "react"
import classNames from "classnames"

import {type FixedPos, clearTextSelection, selectText} from "../../lib/Doc"
import {XViewerFieldActions} from "../FieldActions"
import {getTooltipStyle} from "../../lib/MenuStyler"
import CellValue from "./CellValue"
import Field from "../../models/Field"
import Log from "../../models/Log"
import Tooltip from "../Tooltip"

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
    clearTextSelection()
    e.stopPropagation()
    this.setState({
      hover: true,
      tooltipStyle: getTooltipStyle(this.el),
      showMenu: true,
      menuStyle: {top: e.pageY, left: e.pageX}
    })
  }

  onMenuDismiss = (e: MouseEvent) => {
    clearTextSelection()
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
        onClick={e => selectText(e.currentTarget)}
        style={this.props.style}
        ref={r => (this.el = r)}
      >
        <CellValue field={this.props.field} />

        {this.state.hover && (
          <Tooltip style={this.state.tooltipStyle}>
            <span className="field-name">{name}</span>
          </Tooltip>
        )}

        {this.state.showMenu && (
          <XViewerFieldActions
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
