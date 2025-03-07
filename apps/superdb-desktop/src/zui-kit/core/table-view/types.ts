import {ColumnSizingInfoState} from "@tanstack/react-table"
import * as zed from "../../../../../../packages/superdb-types/dist"
import {Controller, MakeControllers} from "src/zui-kit/types/utils"
import {ViewConfig} from "../value-view/types"
import {ZedColumn} from "../../table/column"
import {Cell} from "src/zui-kit/table/cell"

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

type CellMouseEventHandler = (
  e: React.MouseEvent,
  value: zed.Value,
  field: zed.Field | null,
  cell: Cell
) => void

type HeaderMouseEventHandler = (e: React.MouseEvent, column: ZedColumn) => void

export type TableViewArgs = {
  values: zed.Value[]
  shape: zed.Type
  viewConfig?: ViewConfig
  onScroll?: (props: {top: number; left: number}) => void
  headerCellProps?: {
    onContextMenu?: HeaderMouseEventHandler
  }
  cellProps?: {
    onContextMenu?: CellMouseEventHandler
    onDoubleClick?: CellMouseEventHandler
    onClick?: CellMouseEventHandler
  }
  state?: TableViewController
  initialScrollPosition?: {top: number; left: number}
} & Partial<TableViewOptionalControllers>

export type TableViewProps = TableViewArgs &
  TableViewController &
  TableViewOptionalControllers
