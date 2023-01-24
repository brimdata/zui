import {Table, createTable} from "@tanstack/table-core"
import {zed} from "@brimdata/zealot"
import {config} from "../../../components/zed-table/config"
import {Cell} from "../../../components/zed-table/cell"
import {Position} from "../../../components/zed-table/position"
import {getMaxCellSizes} from "../../../components/zed-table/utils"
import {GridState, TableEvent} from "../../../components/zed-table/types"
import {createColumns} from "../../../components/zed-table/create-columns"
import {ZedColumn} from "../../../components/zed-table/column"
import {TableViewArgs} from "./types"
import {Controller} from "src/zui-kit/types/utils"
import memoizeOne from "memoize-one"

export class TableViewApi {
  element: HTMLDivElement | null = null
  private grid: GridState = {rowStart: 0, rowStop: 0, colStart: 0, colStop: 0}
  private event: TableEvent = "init"
  private cells: Map<string, Cell> = new Map()
  private listeners = []
  public baseColumns: ZedColumn[]
  public table: Table<any>

  constructor(public args: TableViewArgs) {
    this.baseColumns = createColumns(this, this.shape)

    this.table = createTable({
      data: [],
      columns: this.baseColumns.map((c) => c.def),
      columnResizeMode: "onChange",
      defaultColumn: {size: config.defaultCellWidth},
      onStateChange: () => {},
      getCoreRowModel: () => null,
      renderFallbackValue: null,
      state: this.tanstackTableState,
      initialState: this.tanstackTableState,
      ...this.tanstackHandlers,
    })
    this.table.setOptions((prev) => ({...prev, state: this.table.initialState}))
  }

  update(args: TableViewArgs) {
    this.args = args
    this.baseColumns = createColumns(this, this.shape)
    this.table.setOptions((prev) => ({
      ...prev,
      ...this.tanstackHandlers,
      columns: this.baseColumns.map((c) => c.def),
      state: {...prev.state, ...this.tanstackTableState},
    }))
  }

  private get tanstackTableState() {
    return {
      columnSizing: this.args.columnWidthState.value,
      columnVisibility: this.args.columnVisibleState.value,
      columnSizingInfo: this.args.columnResizeInfoState.value,
    }
  }

  private get tanstackHandlers() {
    return {
      onColumnSizingChange: this.tanstackUpdater(this.args.columnWidthState),
      onColumnVisibilityChange: this.tanstackUpdater(
        this.args.columnVisibleState
      ),
      onColumnSizingInfoChange: this.tanstackUpdater(
        this.args.columnResizeInfoState
      ),
    }
  }

  private tanstackUpdater(ctl: Controller<any>) {
    return (updater) => {
      const value = typeof updater === "function" ? updater(ctl.value) : updater
      ctl.onChange(value)
    }
  }

  get shape() {
    return this.args.shape
  }

  get values() {
    return this.args.values
  }

  get headerGroups() {
    return memoHeaderGroups(
      this,
      this.args.columnWidthState.value,
      this.args.columnVisibleState.value
    )
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
    return memoColumns(this, this.args.columnVisibleState.value)
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
    return memoGetRowHeight(this, rowIndex)
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
      const field = column.accessorFn(root, rowIndex) as zed.Field | null
      const cell = new Cell({
        api: this,
        columnId: column.id,
        position,
        field,
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
    const prev = this.args.columnWidthState.value
    this.args.columnWidthState.onChange({...prev, ...sizes})
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
    const widths = this.args.columnWidthState.value
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
    return this.event === "interaction" || this.event === "scroll"
  }

  showAllColumns() {
    this.args.columnVisibleState.onChange({})
  }

  hideAllColumns() {
    const ids = this.baseColumns.flatMap((c) => [c.id, ...c.decendentIds])
    const obj = {}
    for (let id of ids) obj[id] = false
    this.args.columnVisibleState.onChange(obj)
  }

  expandAllColumns() {
    this.args.columnExpandedDefaultState.onChange(true)
    this.args.columnExpandedState.onChange({})
  }

  collapseAllColumns() {
    this.args.columnExpandedDefaultState.onChange(false)
    this.args.columnExpandedState.onChange({})
  }

  columnIsVisible(id: string) {
    return this.args.columnVisibleState.value[id] ?? true
  }

  setColumnVisible(state: Record<string, boolean>) {
    const prev = this.args.columnVisibleState.value
    this.args.columnVisibleState.onChange({...prev, ...state})
  }

  columnIsExpanded(id: string) {
    return (
      this.args.columnExpandedState.value[id] ??
      this.args.columnExpandedDefaultState.value
    )
  }

  setColumnExpanded(id: string, value: boolean) {
    const prev = this.args.columnExpandedState.value
    this.args.columnExpandedState.onChange({...prev, [id]: value})
  }

  columnIsSortedAsc(fieldPath: string) {
    return this.args.columnSortedState.value[fieldPath] === "asc"
  }

  columnIsSortedDesc(fieldPath: string) {
    return this.args.columnSortedState.value[fieldPath] === "desc"
  }

  valueIsExpanded(id: string) {
    return this.args.valueExpandedState.value[id] ?? false
  }

  setValueExpanded(id: string, value: boolean) {
    const prev = this.args.valueExpandedState.value
    this.args.valueExpandedState.onChange({...prev, [id]: value})
  }

  valuePage(id: string) {
    return this.args.valuePageState.value[id] ?? 1
  }

  setValuePage(id: string, page: number) {
    const prev = this.args.valuePageState.value
    this.args.valuePageState.onChange({...prev, [id]: page})
  }

  nearBottom(n: number) {
    return this.grid.rowStop >= this.values.length - n
  }
}

const memoColumns = memoizeOne(
  (api: TableViewApi, _visible: Record<string, boolean>) => {
    return api.table.getVisibleLeafColumns()
  }
)

const memoHeaderGroups = memoizeOne(
  (
    api: TableViewApi,
    _widths: Record<string, number>,
    _visible: Record<string, boolean>
  ) => {
    return api.table.getHeaderGroups()
  }
)

const memoGetRowHeight = memoizeOne((api: TableViewApi, rowIndex: number) => {
  let maxLines = 1
  for (let columnIndex = 0; columnIndex < api.columnCount; columnIndex++) {
    const cell = api.getCell(columnIndex, rowIndex)
    if (cell.lineCount > maxLines) maxLines = cell.lineCount
  }
  return config.lineHeight * (maxLines - 1) + config.rowHeight
})
