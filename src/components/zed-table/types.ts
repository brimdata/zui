import React from "react"
import {zed} from "packages/zealot/src"
import {Column} from "./column"

export type TableHandlers = {
  getValuePage: (valueId: string) => number
  incValuePage: (valueId: string) => void
  isExpanded: (valueId: string) => boolean
  setExpanded: (valueId: string, value: boolean) => void
  isGrouped: (shape: zed.Type, columnId: string) => boolean
  setGrouped: (shape: zed.Type, columnId: string, value: boolean) => void
  setColumnWidths: (shape: zed.Type, widths: Record<string, number>) => void
  getColumnWidths: (shape: zed.Type) => Record<string, number>
  onHeaderMenu: (e: React.MouseEvent, column: Column) => void
}

export type GridState = {
  rowStart: number
  rowStop: number
  colStart: number
  colStop: number
}

export type TableEvent = "init" | "scroll" | "interaction"
