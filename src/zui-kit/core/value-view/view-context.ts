import {ReactNode} from "react"
import {Controller} from "src/zui-kit/types/utils"
import {RowData, ValueMouseEventHandler, ViewConfig} from "./types"

type Args = ViewConfig & {
  expandedState: Controller<Record<string, boolean>>
  expandedDefaultState: Controller<boolean>
  pageState: Controller<Record<string, number>>
  onClick: ValueMouseEventHandler
  onContextMenu: ValueMouseEventHandler
  viewIdPrefix?: string
  onDidChange?: () => void
}

export class ViewContext {
  rows = [] as RowData[]
  indent = 0
  customViews: ViewConfig["customViews"]
  expandedState: Controller<Record<string, boolean>>
  expandedDefaultState: Controller<boolean>
  pageState: Controller<Record<string, number>>
  onClick: Args["onClick"]
  onContextMenu: Args["onContextMenu"]
  onDidChange: () => void
  lineLimit: number
  peekLimit: number
  rowsPerPage: number
  rowLimit: number
  hideSyntax: boolean
  hideKeys: boolean
  viewIdPrefix: string

  constructor(args: Args) {
    this.customViews = args.customViews ?? []
    this.lineLimit = args.lineLimit ?? 15 // How many fields to show on a line
    this.peekLimit = args.peekLimit ?? 2 // How many fields to show in a nested value
    this.rowsPerPage = args.rowsPerPage ?? 100 // How many rows to show before prompting for the "next" page
    this.rowLimit = args.rowLimit ?? Infinity // Hard limit for number of rows in case list is not virtualized
    this.hideKeys = args.hideKeys ?? false
    this.hideSyntax = args.hideSyntax ?? false
    this.expandedState = args.expandedState
    this.expandedDefaultState = args.expandedDefaultState
    this.pageState = args.pageState
    this.viewIdPrefix = args.viewIdPrefix ?? ""
    this.onClick = args.onClick ?? (() => {})
    this.onContextMenu = args.onContextMenu ?? (() => {})
    this.onDidChange = args.onDidChange ?? (() => {})
  }

  nest() {
    this.indent += 1
  }

  unnest() {
    this.indent -= 1
  }

  // This can be any renderable thing for the framework
  push(render: ReactNode) {
    this.rows.push({
      render,
      indent: this.indent,
    })
  }

  page(id: string) {
    const key = this.addPrefix(id)
    return this.pageState.value[key] ?? 1
  }

  setPage(id: string, value: number) {
    const prev = this.pageState.value
    const key = this.addPrefix(id)
    if (prev[key] !== value) {
      this.pageState.onChange({...prev, [key]: value})
      this.onDidChange()
    }
  }

  isExpanded(id: string) {
    const key = this.addPrefix(id)
    return this.expandedState.value[key] ?? this.expandedDefaultState.value
  }

  setIsExpanded(id: string, value: boolean) {
    const prev = this.expandedState.value
    const key = this.addPrefix(id)
    if (prev[key] !== value) {
      this.expandedState.onChange({...prev, [key]: value})
      this.onDidChange()
    }
  }

  private addPrefix(id: string) {
    return this.viewIdPrefix + id
  }
}
