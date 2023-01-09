import React from "react"
import {zed} from "packages/zealot/src"
import {ZedColumn} from "./column"
import {ColumnSizingInfoState} from "@tanstack/react-table"

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
  onHeaderMenu: (e: React.MouseEvent, column: ZedColumn) => void
}

export const defaultState = (): ZedTableState => ({
  valueExpanded: {},
  valuePage: {},
  columnWidth: {},
  columnExpanded: {},
  columnVisible: {},
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
