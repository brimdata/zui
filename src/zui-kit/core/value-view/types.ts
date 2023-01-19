import {zed} from "@brimdata/zealot"
import {View} from "src/app/features/inspector/views/view"

export type ViewConfig = {
  customViews?: typeof View[]
  hideKeys?: boolean
  hideSyntax?: boolean
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
  value: zed.Any,
  field: zed.Field | zed.FieldData | null
) => void
