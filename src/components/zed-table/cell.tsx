import {flexRender} from "@tanstack/react-table"
import React from "react"
import {GridChildComponentProps} from "react-window"
import styled from "styled-components"
import {useZedTable} from "./context"
import {useCellStyle} from "./utils"

const BG = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  a {
    display: flex;
    align-items: center;
  }
  padding: 0 10px;
`

export function Cell({style, columnIndex, rowIndex}: GridChildComponentProps) {
  const {table} = useZedTable()
  const row = table.getRowModel().rows[rowIndex]
  const cell = row.getVisibleCells()[columnIndex]
  const cellStyle = useCellStyle(style)
  if (!cell) return <BG>"No Cell"</BG>

  return (
    <BG style={cellStyle} id={cell.id} data-column-id={cell.column.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </BG>
  )
}
