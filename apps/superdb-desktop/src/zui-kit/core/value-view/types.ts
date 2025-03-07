import * as zed from "../../../../../../packages/superdb-types/dist"
import {View} from "src/views/inspector/views/view"

export type ViewConfig = {
  customViews?: typeof View[]
  hideKeys?: boolean
  hideSyntax?: boolean
  hideDecorators?: boolean
  lineLimit?: number
  peekLimit?: number
  rowLimit?: number
  rowsPerPage?: number
}

export type RowData = {
  indent: number
  render: any // ReactNode
}

export type RenderMode = "single" | "peek" | "line" | "expanded"

export type ValueMouseEventHandler = (
  e: React.MouseEvent,
  value: zed.Value,
  field: zed.Field | null
) => void
