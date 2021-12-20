import {MouseEvent, ReactNode} from "react"
import {zed} from "@brimdata/zealot"
import {InspectorContext} from "./context"

export type IsExpanded = (v: zed.Value | zed.Type) => boolean
export type SetExpanded = (v: zed.Value | zed.Type, b: boolean) => void

type OnContextMenu = (
  e: MouseEvent,
  value: zed.Value | zed.Type,
  field: zed.Field
) => void

export type InspectorProps = {
  rowHeight: number
  height: number
  width: number
  values: zed.Value[]
  defaultExpanded: boolean
  expanded: Map<zed.Value | zed.Type, boolean>
  setExpanded: (m: Map<zed.Value | zed.Type, boolean>) => void
  onContextMenu: OnContextMenu
}

export type InspectArgs = {
  ctx: InspectorContext
  value: zed.Value | zed.Type
  field: zed.Field | null
  type: zed.Type
  key: string | null
  last: boolean
  rootValueIndex: number
}

export type RowData = {
  rootValueIndex: number
  indent: number
  render: ReactNode
}
