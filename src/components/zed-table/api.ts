import {Table as ReactTable} from "@tanstack/react-table"
import {zed} from "@brimdata/zealot"
import {config} from "./config"
import {MutableRefObject} from "react"
import {AppDispatch} from "src/js/state/types"
import Table from "src/js/state/Table"
import {TabState} from "src/js/state/Tab/types"
import {View} from "src/app/features/inspector/views/view"
import {max} from "lodash"
import {InspectContext} from "src/app/features/inspector/inspect-list"
import {createView} from "src/app/features/inspector/views/create"

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
  dispatch: Args["dispatch"]
  state: Args["state"]
  private tableInstance: null | ReactTable<zed.Value>
  private cellViews: Map<string, View> = new Map()

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

  get headerHeight() {
    return this.table.getHeaderGroups().length * config.headerHeight
  }

  get isResizing() {
    return this.columns.some((c) => c.getIsResizing())
  }

  get columns() {
    return this.table.getAllColumns()
  }

  get container() {
    if (!this.ref.current) throw new Error("table container not rendered")
    return this.ref.current
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  getView(cellId: string, value: zed.Value) {
    if (this.cellViews.has(cellId)) {
      return this.cellViews.get(cellId)
    } else {
      const ctx = new InspectContext(this)
      const view = createView({
        ctx,
        value: value,
        type: value.type,
        field: null,
        key: null,
        last: true,
        indexPath: [cellId],
      })
      view.inspect()
      this.cellViews.set(cellId, view)
      return view
    }
  }

  getColumnWidth(key: string) {
    return this.state.columnWidths.get(key)
  }

  setColumnWidths(sizes: Record<string, number>) {
    // Maybe these dispatch calls go in the parent container so we can make this generic
    // Do that later...
    this.dispatch(Table.setColumnWidths(sizes))
    this.table.setColumnSizing((prev) => ({...prev, ...sizes}))
  }

  getRowHeight(index: number) {
    const row = this.rows[index]
    const rowCounts = row
      .getAllCells()
      .map((cell) =>
        this.getView(cell.id, cell.getValue<zed.Value>()).rowCount()
      )
    return config.lineHeight * (max(rowCounts) - 1) + config.rowHeight
  }

  isExpanded(key: string) {
    return !!this.state.expanded.get(key)
  }

  setExpanded(valueId: string, isExpanded: boolean) {
    const [cellId] = valueId.split(",")
    this.cellViews.delete(cellId)
    this.cellChanged(cellId)
    this.dispatch(Table.setExpanded({key: valueId, isExpanded}))
  }
  private listeners = []
  cellChanged(id: string) {
    this.listeners.forEach((listener) => listener(id))
  }

  onCellChanged(fn: (id: string) => void) {
    this.listeners.push(fn)
  }

  getValuePage(key: string) {
    return this.state.valuePages.get(key) ?? 1
  }

  renderMore(key: string) {}
}
