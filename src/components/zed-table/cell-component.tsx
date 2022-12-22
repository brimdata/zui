import classNames from "classnames"
import React, {startTransition, useEffect, useState} from "react"
import {GridChildComponentProps} from "react-window"
import {CellValue} from "./cell-value"
import {useZedTable} from "./context"
import {useCellStyle} from "./utils"

/**
 * The Cell has the ability to defer rendering
 * the actually contents of the cell. This allows
 * for really fluid mounting and scrolling. The
 * cell background color and size render first
 * and fast, then the contents fills in when
 * the browser has a chance to catch up.
 *
 * However, if the user is interacting with a
 * single cell, we want that cell to render
 * immediately, not defer. So we keep track
 * of the last event that was fired on the
 * table. If the last event was an interaction,
 * not a scroll, then render immediately.
 */
export const Cell = React.memo(function Cell({
  style,
  columnIndex,
  rowIndex,
}: GridChildComponentProps) {
  const api = useZedTable()
  const cell = api.getCell(columnIndex, rowIndex)

  if (api.shouldRenderImmediately) cell.inspect()

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
