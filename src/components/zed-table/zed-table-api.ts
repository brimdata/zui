import {Table, createTable} from "@tanstack/table-core"
import {zed} from "@brimdata/zealot"
import {config} from "./config"
import {Cell} from "./cell"
import {Position} from "./position"
import {getMaxCellSizes} from "./utils"
import {
  defaultState,
  GridState,
  TableEvent,
  ZedTableHandlers,
  ZedTableState,
} from "./types"
import {createColumns} from "./create-columns"
import {ZedColumn} from "./column"

export class ZedTableApi {
  element: HTMLDivElement | null = null
  private grid: GridState = {rowStart: 0, rowStop: 0, colStart: 0, colStop: 0}
  private event: TableEvent = "init"
  private cells: Map<string, Cell> = new Map()
  private listeners = []
  public baseColumns: ZedColumn[]
  private table: Table<any>

  constructor(
    public shape: zed.Type,
    public values: zed.Value[],
    public state: ZedTableState,
    public handlers: ZedTableHandlers
  ) {
    this.state = {...defaultState(), ...state}
    this.baseColumns = createColumns(this, shape)
    this.table = createTable({
      data: [],
      columns: this.baseColumns.map((c) => c.def),
      columnResizeMode: "onChange",
      defaultColumn: {size: config.defaultCellWidth},
      onStateChange: (updater) => {
        const next =
          typeof updater === "function"
            ? updater(this.table.getState())
            : updater
        handlers.onStateChange({
          ...this.state,
          columnWidth: next.columnSizing,
          columnVisible: next.columnVisibility,
          columnResizeInfo: next.columnSizingInfo,
        })
      },
      getCoreRowModel: () => null,
      renderFallbackValue: null,
      state: {
        columnSizing: this.state.columnWidth,
        columnVisibility: this.state.columnVisible,
        columnSizingInfo: this.state.columnResizeInfo,
      },
    })
    this.table.setOptions((prev) => ({...prev, state: this.table.initialState}))
  }

  update(state: ZedTableState) {
    // Combine whats similar in this and the constructor
    // Next up is the value expands and collapses and pages

    this.state = {...this.state, ...state}
    console.log(this.state.columnVisible)
    const tableState = {
      columnSizing: this.state.columnWidth,
      columnVisibility: this.state.columnVisible,
      columnSizingInfo: this.state.columnResizeInfo,
    }
    this.baseColumns = createColumns(this, this.shape)
    this.table.setOptions((prev) => ({
      ...prev,
      columns: this.baseColumns.map((c) => c.def),
      state: {...prev.state, ...tableState},
    }))
  }

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get totalHeaderHeight() {
    return (
      (this.headerGroups.length - 1) * config.placeholderHeaderHeight +
      config.headerHeight
    )
  }

  get isResizing() {
    return this.table.getState().columnSizingInfo.isResizingColumn
  }

  get columns() {
    return this.table.getVisibleLeafColumns()
  }

  get columnCount() {
    return this.columns.length
  }

  get hiddenColumnCount() {
    return (
      this.table.getAllFlatColumns().length -
      this.table.getVisibleFlatColumns().length
    )
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
    const column = this.columns[columnIndex]
    if (!column) throw Error("No Column")
    const cellId = Cell.createId(column.id, rowIndex)

    if (this.cells.has(cellId)) {
      return this.cells.get(cellId)
    } else {
      const root = this.values[rowIndex]
      if (!root) throw new Error("No Root Value")
      const value = column.accessorFn(root, rowIndex) as zed.Value
      const cell = new Cell({
        api: this,
        columnId: column.id,
        position,
        value: value ?? new zed.Null(),
      })
      this.cells.set(cellId, cell)
      return cell
    }
  }

  cellChanged(cell: Cell) {
    this.event = "interaction"
    this.cells.delete(cell.id)
    this.listeners.forEach((listener) => listener(cell))
  }

  onCellChanged(fn: (cell: Cell) => void) {
    this.listeners.push(fn)
  }

  setColumnWidths(sizes: Record<string, number>) {
    this.handlers.onStateChange({
      ...this.state,
      columnWidth: {
        ...this.state.columnWidth,
        ...sizes,
      },
    })
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
    const widths = this.state.columnWidth
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

  showAllColumns() {
    this.handlers.onStateChange({
      ...this.state,
      columnVisible: {},
    })
  }

  hideAllColumns() {
    const ids = this.baseColumns.flatMap((c) => [c.id, ...c.decendentIds])
    const obj = {}
    for (let id of ids) obj[id] = false
    this.handlers.onStateChange({
      ...this.state,
      columnVisible: obj,
    })
  }

  expandAllColumns() {
    const ids = this.baseColumns.flatMap((c) => [c.id, ...c.decendentIds])
    const obj = {}
    for (let id of ids) obj[id] = true
    this.handlers.onStateChange({
      ...this.state,
      columnExpanded: obj,
    })
  }

  collapseAllColumns() {
    const ids = this.baseColumns.flatMap((c) => [c.id, c.decendentIds])
    const obj = {}
    for (let id of ids) obj[id] = false
    this.handlers.onStateChange({
      ...this.state,
      columnExpanded: obj,
    })
  }

  columnIsVisible(id: string) {
    return this.state.columnVisible[id] ?? true
  }

  setColumnVisible(state: Record<string, boolean>) {
    this.handlers.onStateChange({
      ...this.state,
      columnVisible: {...this.state.columnVisible, ...state},
    })
  }

  columnIsExpanded(id: string) {
    return !!this.state.columnExpanded[id]
  }

  setColumnExpanded(id: string, value: boolean) {
    this.handlers.onStateChange({
      ...this.state,
      columnExpanded: {...this.state.columnExpanded, [id]: value},
    })
  }

  valueIsExpanded(id: string) {
    return !!this.state.valueExpanded[id]
  }

  setValueExpanded(id: string, value: boolean) {
    this.handlers.onStateChange({
      ...this.state,
      valueExpanded: {...this.state.valueExpanded, [id]: value},
    })
  }

  valuePage(id: string) {
    return this.state.valuePage[id] ?? 1
  }

  setValuePage(id: string, page: number) {
    this.handlers.onStateChange({
      ...this.state,
      valuePage: {...this.state.valuePage, [id]: page},
    })
  }
}
