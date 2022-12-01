import React from "react"
import {GridChildComponentProps} from "react-window"
import styled from "styled-components"
import {useZedTable} from "./context"

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
  const row = table.rows[rowIndex]
  table.prepareRow(row)
  const cell = row.cells[columnIndex]
  if (!cell) return <BG>"No Cell"</BG>
  return <BG style={style}>{cell.render("Cell")}</BG>
}
