import classNames from "classnames"
import React, {startTransition, useEffect, useReducer} from "react"
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
  const [renderCount, render] = useReducer((n) => n + 1, 0)

  useEffect(() => {
    if (cell.isInspected) api.cellInspected(cell)
  }, [cell, renderCount])

  useEffect(() => {
    if (cell.isInspected) return
    startTransition(() => {
      cell.inspect()
      render()
    })
  }, [cell])

  return (
    <div
      className={classNames("zed-table__cell", {even: rowIndex % 2 == 0})}
      style={useCellStyle(style)}
      id={cell.id}
      data-column-id={cell.columnId}
      onContextMenu={(e) =>
        api.args?.cellProps?.onContextMenu(e, cell.value, cell.field, cell)
      }
      onDoubleClick={(e) => {
        api.args?.cellProps?.onDoubleClick(e, cell.value, cell.field, cell)
      }}
      onClick={(e) => {
        api.args?.cellProps?.onClick(e, cell.value, cell.field, cell)
      }}
    >
      <CellValue view={cell.isInspected ? cell.view : null} />
    </div>
  )
})
