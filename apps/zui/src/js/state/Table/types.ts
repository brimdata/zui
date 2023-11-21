import * as zed from "@brimdata/zed-js"
import {ColumnSizingInfoState} from "@tanstack/react-table"

// This is saved per table instance
export type TableState = {
  columnExpandedDefault: boolean // table
  columnResizeInfo: ColumnSizingInfoState // table
  shape: zed.Type
  settings: Map<zed.Type, TableSettingsState>
  scrollPosition: {top: 0; left: 0}
}

// This is saved per shape in each table instance
export type TableSettingsState = {
  valueExpanded: {}
  valuePage: {}
  columnWidth: {}
  columnExpanded: {}
  columnVisible: {}
  columnSorted: {}
}
