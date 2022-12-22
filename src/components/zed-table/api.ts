import {Column, Table as ReactTable} from "@tanstack/react-table"
import {zed} from "@brimdata/zealot"
import {config} from "./config"
import {Cell} from "./cell"
import {Position} from "./position"
import {getMaxCellSizes} from "./utils"
import {GridState, TableEvent, TableHandlers} from "./types"

export class ZedTableApi {
  element: HTMLDivElement | null = null
  private grid: GridState = {rowStart: 0, rowStop: 0, colStart: 0, colStop: 0}
  private event: TableEvent = "init"
  private cells: Map<string, Cell> = new Map()
  private listeners = []
  private _table: null | ReactTable<zed.Value>
  private _headerGroups = null
  private _columns: Column<zed.Value, unknown>[] | null = null

  constructor(
    public shape: zed.Type,
    public values: zed.Value[],
    public handlers: TableHandlers,
    public reset: () => void
  ) {}

  set table(t: ReactTable<zed.Value>) {
    this._table = t
  }

  get table() {
    if (this._table) return this._table
    throw new Error("No Table Yet")
  }

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

  get columns() {
    // if (this._columns) return this._columns
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
    let maxLines = 1
    for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
      const cell = this.getCell(columnIndex, rowIndex)
      if (cell.lineCount > maxLines) maxLines = cell.lineCount
    }
    return config.lineHeight * (maxLines - 1) + config.rowHeight
  }

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

  cellChanged(cell: Cell) {
    this.event = "interaction"
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
      this.grid.rowStop === cell.position.rowIndex &&
      this.grid.colStop === cell.position.columnIndex
    ) {
      this.autosizeColumns()
    }
  }

  autosizeColumns(columnIds?: string[]) {
    const widths = this.handlers.getColumnWidths(this.shape) ?? {}
    if (this.element) {
      const ids =
        columnIds ??
        this.columns
          .slice(this.grid.colStart, this.grid.colStop + 1)
          .filter((col) => !(col.id in widths))
          .map((col) => col.id)

      if (ids.length === 0) return
      this.setColumnWidths(getMaxCellSizes(this.element, ids))
    }
  }

  setLastEvent(e: TableEvent) {
    this.event = e
  }

  setGridState(state: GridState) {
    this.grid = state
  }

  get shouldRenderImmediately() {
    return this.event === "interaction"
  }
}
