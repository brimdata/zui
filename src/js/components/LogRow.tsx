import {FormatConfig} from "src/app/core/format"
import Cell from "src/app/viewer/cell"
import Value from "src/app/viewer/value"
import classNames from "classnames"
import isEqual from "lodash/isEqual"
import React, {memo, MouseEvent} from "react"
import {zed} from "@brimdata/zealot"
import TableColumns from "../models/TableColumns"
import {ViewerDimens} from "../types"
import * as Styler from "./Viewer/Styler"

type Props = {
  displayConfig: FormatConfig
  dimens: ViewerDimens
  highlight: boolean
  index: number
  log: zed.Record
  columns: TableColumns
  onClick: (e: MouseEvent) => void
  onDoubleClick: (e: MouseEvent) => void
}

const LogRow = (props: Props) => {
  const {dimens, highlight, index, log, columns, onClick, onDoubleClick} = props

  const renderCell = (column, colIndex) => {
    const width = dimens.rowWidth !== "auto" ? column.width || 300 : "auto"
    const field = log.tryField(column.name)
    const key = `${index}-${colIndex}`
    if (field && field.data && !(field.data instanceof zed.Record)) {
      return (
        <Cell
          width={width}
          key={key}
          name={field.path}
          type={field.data.type.toString()}
        >
          <Value
            shallow={false}
            displayConfig={props.displayConfig}
            value={field.value}
            field={field}
            record={log}
            padBefore
            padAfter
          />
        </Cell>
      )
    }
    if (dimens.rowWidth !== "auto") {
      return <div className="log-cell" key={key} style={{width}} />
    }
  }
  return (
    <div
      role="row"
      className={classNames("log-row", {highlight, even: index % 2 === 0})}
      style={Styler.row(dimens)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {log instanceof zed.Record
        ? columns.getVisible().map(renderCell)
        : "The table view can only render records at the moment."}
    </div>
  )
}

export default memo<Props>(LogRow, (prevProps: Props, nextProps: Props) => {
  return (
    isEqual(prevProps.log, nextProps.log) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.dimens.rowWidth === nextProps.dimens.rowWidth &&
    prevProps.displayConfig === nextProps.displayConfig
  )
})
