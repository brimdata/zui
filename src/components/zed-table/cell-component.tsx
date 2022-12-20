import classNames from "classnames"
import React, {useEffect, useLayoutEffect, useState} from "react"
import {GridChildComponentProps} from "react-window"
import {CellValue} from "./cell-value"
import {useZedTable} from "./context"
import {useCellStyle} from "./utils"

export const Cell = React.memo(function Cell({
  style,
  columnIndex,
  rowIndex,
}: GridChildComponentProps) {
  const api = useZedTable()
  const cell = api.getCell(columnIndex, rowIndex)
  const [ready, setReady] = useState(false)
  const [_, startTransition] = React.useTransition()

  useEffect(() => {
    startTransition(() => {
      cell.inspect()
      setReady(true)
    })
  }, [cell])

  useLayoutEffect(() => {
    if (ready) {
      api.cellInspected(cell)
    }
  }, [ready])

  return (
    <div
      className={classNames("zed-table__cell", {even: rowIndex % 2 == 0})}
      style={useCellStyle(style)}
      id={cell.id}
      data-column-id={cell.columnId}
    >
      <CellValue view={cell.view} key={ready ? "on" : "off"} />
    </div>
  )
})
