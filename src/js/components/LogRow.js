/* @flow */

import React from "react"
import classNames from "classnames"
import isEqual from "lodash/isEqual"

import type {RightClickBuilder, ViewerDimens} from "../types"
import Log from "../models/Log"
import LogCell from "./LogCell"
import * as Styler from "./Viewer/Styler"
import TableColumns from "../models/TableColumns"

type Props = {
  dimens: ViewerDimens,
  highlight: boolean,
  index: number,
  timeZone: string,
  timeFormat: string,
  log: Log,
  columns: TableColumns,
  onClick: () => void,
  rightClick: RightClickBuilder,
  showColumnHeaders: boolean
}

export default class LogRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      !Log.isSame(this.props.log, nextProps.log) ||
      !isEqual(this.props.columns, nextProps.columns) ||
      this.props.highlight !== nextProps.highlight ||
      this.props.dimens.rowWidth !== nextProps.dimens.rowWidth ||
      this.props.timeZone !== nextProps.timeZone ||
      this.props.timeFormat !== nextProps.timeFormat ||
      this.props.showColumnHeaders !== nextProps.showColumnHeaders
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
    const {
      dimens,
      highlight,
      index,
      log,
      rightClick,
      columns,
      showColumnHeaders
    } = this.props
    const renderCell = (column, colIndex) => {
      const width = dimens.rowWidth !== "auto" ? column.width || 300 : "auto"
      const field = log.field(column.name)
      const key = `${index}-${colIndex}`
      if (field) {
        return (
          <LogCell
            rightClick={rightClick}
            key={key}
            field={field}
            log={log}
            style={{width}}
          />
        )
      }
      if (showColumnHeaders) {
        return <div className="log-cell" key={key} style={{width}} />
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
}
