import React from "react"
import {zed} from "@brimdata/zealot"
import {ZedColumn} from "./column"
import {ColumnSizingInfoState} from "@tanstack/react-table"
import {Cell} from "./cell"

export type GridState = {
  rowStart: number
  rowStop: number
  colStart: number
  colStop: number
}

export type TableEvent = "init" | "scroll" | "interaction"

export type ZedTableState = {
  valueExpanded: {}
  valuePage: {}
  columnWidth: {}
  columnExpanded: {}
  columnVisible: {}
  columnSorted: {}
  columnExpandedDefault: boolean
  columnResizeInfo: ColumnSizingInfoState
}

export type ZedTableProps = {
  shape: zed.Type
  values: zed.Value[]
  state: ZedTableState
} & ZedTableHandlers

export type ZedTableHandlers = {
  onStateChange: (nextState: ZedTableState) => void
  onScrollNearBottom: () => void
  onHeaderContextMenu: (e: React.MouseEvent, column: ZedColumn) => void
  onValueContextMenu: (
    e: React.MouseEvent,
    value: zed.Value,
    field: zed.Field,
    cell: Cell
  ) => void
}

export const defaultState = (): ZedTableState => ({
  valueExpanded: {},
  valuePage: {},
  columnWidth: {},
  columnExpanded: {},
  columnVisible: {},
  columnSorted: {},
  columnExpandedDefault: false,
  columnResizeInfo: {
    isResizingColumn: false,
    startOffset: 0,
    deltaOffset: 0,
    startSize: 0,
    deltaPercentage: 0,
    columnSizingStart: [],
  },
})
