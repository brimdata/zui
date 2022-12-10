import {Table as ReactTable} from "@tanstack/react-table"
import {zed} from "@brimdata/zealot"
import {config} from "./config"
import {MutableRefObject} from "react"
import {AppDispatch} from "src/js/state/types"
import Table from "src/js/state/Table"
import {TabState} from "src/js/state/Tab/types"
import {View} from "src/app/features/inspector/views/view"
import {max} from "lodash"

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

  getColumnWidth(key: string) {
    return this.state.columnWidths.get(key)
  }

  setColumnWidths(sizes: Record<string, number>) {
    // Maybe these dispatch calls go in the parent container so we can make this generic
    // Do that later...
    this.dispatch(Table.setColumnWidths(sizes))
    this.table.setColumnSizing(sizes)
  }

  getRowHeight(index: number) {
    const row = this.rows[index]
    const rowCounts = row
      .getAllCells()
      .map((cell) => cell.getValue<View>().rowCount())
    const height = config.rowHeight * max(rowCounts)
    return height
  }

  isExpanded(key: string) {
    return false
    return !!this.state.expanded.get(key)
  }

  setExpanded(key: string, isExpanded: boolean) {
    this.dispatch(Table.setExpanded({key, isExpanded}))
  }

  getValuePage(key: string) {
    return this.state.valuePages.get(key) ?? 1
  }

  renderMore(key: string) {}
}
