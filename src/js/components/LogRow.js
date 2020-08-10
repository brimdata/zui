/* @flow */

import React, {memo} from "react"
import classNames from "classnames"
import isEqual from "lodash/isEqual"

import type {RightClickBuilder, ViewerDimens} from "../types"
import Log from "../models/Log"
import LogCell from "./LogCell"
import * as Styler from "./Viewer/Styler"
import TableColumns from "../models/TableColumns"
import useDoubleClick from "./hooks/useDoubleClick"

type Props = {
  dimens: ViewerDimens,
  highlight: boolean,
  index: number,
  timeZone: string,
  timeFormat: string,
  log: Log,
  columns: TableColumns,
  onClick: () => void,
  onDoubleClick: () => void,
  rightClick: RightClickBuilder
}

const LogRow = (props: Props) => {
  const {
    dimens,
    highlight,
    index,
    log,
    rightClick,
    columns,
    onClick,
    onDoubleClick
  } = props

  const handleClick = useDoubleClick(onClick, onDoubleClick)

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
    if (dimens.rowWidth !== "auto") {
      return <div className="log-cell" key={key} style={{width}} />
    }
  }

  return (
    <div
      className={classNames("log-row", {highlight, even: index % 2 === 0})}
      style={Styler.row(dimens)}
      onClick={handleClick}
    >
      {columns.getVisible().map(renderCell)}
    </div>
  )
}

export default memo<Props>(LogRow, (prevProps: Props, nextProps: Props) => {
  return (
    Log.isSame(prevProps.log, nextProps.log) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.dimens.rowWidth === nextProps.dimens.rowWidth &&
    prevProps.timeZone === nextProps.timeZone &&
    prevProps.timeFormat === nextProps.timeFormat
  )
})
