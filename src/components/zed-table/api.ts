import {Column, Table as ReactTable} from "@tanstack/react-table"
import {zed} from "@brimdata/zealot"
import {config} from "./config"
import {MutableRefObject} from "react"
import {AppDispatch} from "src/js/state/types"
import Table from "src/js/state/Table"
import {TabState} from "src/js/state/Tab/types"
import {Cell} from "./cell"
import {Position} from "./position"
import {getMaxCellSizes} from "./utils"
import {GridOnItemsRenderedProps} from "react-window"

type Args = {
  shape: zed.Type
  values: zed.Value[]
  ref: MutableRefObject<HTMLDivElement>
  state: TabState["table"]
  dispatch: AppDispatch
}

export class ZedTableApi {
  shape: Args["shape"]
  values: Args["values"]
  ref: Args["ref"]
  // get this dispatch out of here to make it re-usable, and the state
  dispatch: Args["dispatch"]
  state: Args["state"]
  gridState: null | GridOnItemsRenderedProps = null
  lastEvent: "mount" | "scroll" | "interaction" = "mount"
  private tableInstance: null | ReactTable<zed.Value>

  constructor(args: Args) {
    this.shape = args.shape
    this.values = args.values
    this.ref = args.ref
    this.state = args.state
    this.dispatch = args.dispatch
  }

  set table(instance) {
    this.tableInstance = instance
  }

  get table() {
    if (this.tableInstance) return this.tableInstance
    throw new Error("First set the table instance")
  }

  get container() {
    if (!this.ref.current) throw new Error("table container not rendered")
    return this.ref.current
  }

  private _headerGroups = null
  get headerGroups() {
    if (this._headerGroups) return this._headerGroups
    return (this._headerGroups = this.table.getHeaderGroups())
  }

  get totalHeaderHeight() {
    return (
      (this.headerGroups.length - 1) * config.placeholderHeaderHeight +
      config.headerHeight
    )
  }

  get isResizing() {
    return this.columns.some((c) => c.getIsResizing())
  }

  private _columns: Column<zed.Value, unknown>[] | null = null
  get columns() {
    if (this._columns) return this._columns
    this._columns = this.table.getVisibleLeafColumns()
    return this._columns
  }

  get columnCount() {
    return this.columns.length
  }

  get rowCount() {
    return this.values.length
  }

  getColumnWidth(colIndex: number) {
    return this.columns[colIndex].getSize()
  }

  getRowHeight(rowIndex: number) {
    // Row height takes forever, cache some more things
    let maxLines = 1
    for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
      const cell = this.getCell(columnIndex, rowIndex)
      if (cell.lineCount > maxLines) maxLines = cell.lineCount
    }
    return config.lineHeight * (maxLines - 1) + config.rowHeight
  }

  private cells: Map<string, Cell> = new Map()
  getCell(columnIndex: number, rowIndex: number) {
    const position = new Position(columnIndex, rowIndex)
    if (this.cells.has(position.id)) {
      return this.cells.get(position.id)
    } else {
      const root = this.values[rowIndex]
      const column = this.columns[columnIndex]
      if (!root) throw new Error("No Root Value")
      if (!column) throw Error("No Column")
      const value = column.accessorFn(root, rowIndex) as zed.Value
      const cell = new Cell({
        api: this,
        columnId: column.id,
        position,
        value: value ?? new zed.Null(),
      })
      this.cells.set(position.id, cell)
      return cell
    }
  }

  private listeners = []
  cellChanged(cell: Cell) {
    this.lastEvent = "interaction"
    this.cells.delete(cell.position.id)
    this.listeners.forEach((listener) => listener(cell))
  }

  onCellChanged(fn: (cell: Cell) => void) {
    this.listeners.push(fn)
  }

  setColumnWidths(sizes: Record<string, number>) {
    this.table.setColumnSizing((prev) => ({...prev, ...sizes}))
  }

  cellInspected(cell: Cell) {
    if (
      this.gridState.overscanRowStopIndex === cell.position.rowIndex &&
      this.gridState.overscanColumnStopIndex === cell.position.columnIndex
    ) {
      this.autosizeColumns()
    }
  }

  hasWidth(columnId: string) {
    return columnId in (this.state.columnWidths.get(this.shape) ?? {})
  }

  autosizeColumns(columnIds?: string[]) {
    const container = this.ref.current
    if (container) {
      const ids =
        columnIds ??
        this.columns
          .slice(
            this.gridState.overscanColumnStartIndex,
            this.gridState.overscanColumnStopIndex + 1
          )
          .filter((col) => !this.hasWidth(col.id))
          .map((col) => col.id)

      if (ids.length === 0) return
      this.setColumnWidths(getMaxCellSizes(container, ids))
    }
  }

  // Move these into the parent component out of the api

  getValuePage(key: string) {
    return this.state.valuePages.get(key) ?? 1
  }

  incValuePage(key: string) {
    this.dispatch(Table.incValuePage({key}))
  }

  isExpanded(key: string) {
    return !!this.state.expanded.get(key)
  }

  isGrouped(key: string) {
    return !!(this.state.columnGroups.get(this.shape) ?? {})[key]
  }

  setGrouped(key: string, isGrouped: boolean) {
    return this.dispatch(
      Table.setColumnGroups({shape: this.shape, groups: {[key]: isGrouped}})
    )
  }

  toggleGrouped(key) {
    this.setGrouped(key, !this.isGrouped(key))
  }

  setExpanded(key: string, isExpanded: boolean) {
    this.dispatch(Table.setExpanded({key, isExpanded}))
  }
}
