import {flexRender} from "@tanstack/react-table"
import classNames from "classnames"
import {zed} from "packages/zealot/src"
import React from "react"
import {GridChildComponentProps} from "react-window"
import styled from "styled-components"
import {CellValue} from "./cell-value"
import {config} from "./config"
import {useZedTable} from "./context"
import {useCellStyle} from "./utils"

const BG = styled.div`
  --background-color: #f9f9f9;
  &.even {
    --background-color: white;
  }

  background-color: var(--background-color);
  overflow: hidden;
  white-space: nowrap;
  padding: ${(config.rowHeight - config.lineHeight) / 2}px 10px;
  padding-right: 0;
  border-right: 1px solid var(--border-color);

  a {
    display: flex;
    align-items: center;
    user-select: none;
  }

  a:hover {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 3px;
    cursor: default;
  }
`

export const Cell = React.memo(function Cell({
  style,
  columnIndex,
  rowIndex,
}: GridChildComponentProps) {
  const api = useZedTable()
  const row = api.rows[rowIndex]
  const cell = row.getVisibleCells()[columnIndex]
  const cellStyle = useCellStyle(style)
  if (!cell) return <BG>"No Cell"</BG>
  const ctx = cell.getContext()
  const value = ctx.getValue<zed.Value>()
  const cellId = ctx.cell.id
  const view = api.getView(cellId, value)
  return (
    <BG
      style={cellStyle}
      id={cell.id}
      data-column-id={cell.column.id}
      className={classNames({even: rowIndex % 2 == 0})}
    >
      <CellValue view={view} />
    </BG>
  )
})
