import classNames from "classnames"
import React, {startTransition, useEffect, useState} from "react"
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
  const immediate = api.lastEvent === "interaction"
  if (immediate) cell.inspect()
  const [isInspected, setIsInspected] = useState(cell.isInspected)

  useEffect(() => {
    if (cell.isInspected) return
    startTransition(() => {
      cell.inspect()
      setIsInspected(true)
    })
  }, [cell])

  useEffect(() => {
    if (isInspected) api.cellInspected(cell)
  }, [isInspected])

  return (
    <div
      className={classNames("zed-table__cell", {even: rowIndex % 2 == 0})}
      style={useCellStyle(style)}
      id={cell.id}
      data-column-id={cell.columnId}
    >
      <CellValue view={cell.isInspected ? cell.view : null} />
    </div>
  )
})
