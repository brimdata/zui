/* @flow */

import React from "react"
import classNames from "classnames"

import type {ViewerDimens} from "../types"
import Log from "../models/Log"
import LogCell from "./LogCell"
import * as Styler from "./Viewer/Styler"
import TableColumns from "../models/TableColumns"

type Props = {
  dimens: ViewerDimens,
  highlight: boolean,
  index: number,
  log: Log,
  columns: TableColumns,
  onClick: () => void
}

export default class LogRow extends React.PureComponent<Props> {
  renderAutoLayout() {
    const {dimens, highlight, index, log} = this.props
    const columns = log.descriptor

    const renderCell = (column, colIndex) => {
      const field = log.getField(column.name)
      if (field) {
        <LogCell
          key={`${index}-${colIndex}`}
          field={field}
          log={log}
          style={{width: "auto"}}
        />
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
    const {highlight, columns, log, dimens, index} = this.props
    const renderCell = (column, colIndex) => {
      const field = log.getField(column.name)
      const style = {width: column.width || 300}
      const key = `${index}-${colIndex}`

      if (field) {
        return <LogCell key={key} field={field} log={log} style={style} />
      } else {
        return (
          <div className="log-cell" key={key} style={{width: column.width}} />
        )
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
