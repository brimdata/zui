/* @flow */

import React from "react"
import classNames from "classnames"
import isEqual from "lodash/isEqual"

import type {RightClickBuilder, ViewerDimens} from "../types"
import Log from "../models/Log"
import LogCell from "./LogCell"
import * as Styler from "./Viewer/Styler"
import TableColumns from "../models/TableColumns"
import columnOrder from "../lib/columnOrder"

type Props = {
  dimens: ViewerDimens,
  highlight: boolean,
  index: number,
  timeZone: string,
  timeFormat: string,
  log: Log,
  columns: TableColumns,
  onClick: () => void,
  rightClick: RightClickBuilder
}

export default class LogRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      !Log.isSame(this.props.log, nextProps.log) ||
      !isEqual(this.props.columns, nextProps.columns) ||
      this.props.highlight !== nextProps.highlight ||
      this.props.dimens.rowWidth !== nextProps.dimens.rowWidth ||
      this.props.timeZone !== nextProps.timeZone ||
      this.props.timeFormat !== nextProps.timeFormat
    )
  }

  renderAutoLayout() {
    const {dimens, highlight, index, log, rightClick} = this.props
    const columns = columnOrder(log.descriptor)
    const renderCell = (column, colIndex) => {
      const field = log.field(column.name)
      if (field) {
        return (
          <LogCell
            rightClick={rightClick}
            key={`${index}-${colIndex}`}
            field={field}
            log={log}
            style={{width: "auto"}}
          />
        )
      }
    }
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(dimens)}
        onClick={this.props.onClick}
      >
        {columns.map(renderCell)}
      </div>
    )
  }

  renderFixedLayout() {
    const {highlight, columns, log, dimens, index, rightClick} = this.props
    const renderCell = (column, colIndex) => {
      const field = log.field(column.name)
      const style = {width: column.width || 300}
      const key = `${index}-${colIndex}`

      if (field) {
        return (
          <LogCell
            rightClick={rightClick}
            key={key}
            field={field}
            log={log}
            style={style}
          />
        )
      } else {
        return <div className="log-cell" key={key} style={style} />
      }
    }
    return (
      <div
        className={classNames("log-row", {highlight, even: index % 2 == 0})}
        style={Styler.row(dimens)}
        onClick={this.props.onClick}
      >
        {columns.getVisible().map(renderCell)}
      </div>
    )
  }

  render() {
    return this.props.dimens.rowWidth !== "auto"
      ? this.renderFixedLayout()
      : this.renderAutoLayout()
  }
}
