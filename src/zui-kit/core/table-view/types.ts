import {ColumnSizingInfoState} from "@tanstack/react-table"
import {zed} from "@brimdata/zealot"
import {Controller, MakeControllers} from "src/zui-kit/types/utils"
import {ViewConfig} from "../value-view/types"
import {ZedColumn} from "src/components/zed-table/column"
import {Cell} from "src/components/zed-table/cell"

export type TableViewState = {
  valueExpanded: Record<string, boolean>
  valuePage: Record<string, number>
  columnWidth: Record<string, number>
  columnExpanded: Record<string, boolean>
  columnExpandedDefault: boolean
  columnVisible: Record<string, boolean>
  columnSorted: Record<string, "asc" | "desc">
  columnResizeInfo: ColumnSizingInfoState
}

export type TableViewOptionalControllers = MakeControllers<TableViewState>
export type TableViewController = Controller<TableViewState>

export type TableViewArgs = {
  values: zed.Value[]
  shape: zed.Type
  viewConfig?: ViewConfig
  onScroll?: (props: {top: number; left: number}) => void
  headerCellProps?: {
    onContextMenu?: (e: React.MouseEvent, column: ZedColumn) => void
  }
  cellProps?: {
    onContextMenu?: (
      e: React.MouseEvent,
      value: zed.Any,
      field: zed.Field | zed.FieldData | null,
      cell: Cell
    ) => void
  }
  state?: TableViewController
  initialScrollPosition?: {top: number; left: number}
} & Partial<TableViewOptionalControllers>

export type TableViewProps = TableViewArgs &
  TableViewController &
  TableViewOptionalControllers
