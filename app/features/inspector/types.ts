import {MouseEvent, ReactNode} from "react"
import {zed} from "@brimdata/zealot"
import {InspectorContext} from "./context"

export type IsExpanded = (v: zed.Value | zed.Type) => boolean
export type SetExpanded = (payload: {
  args: InspectArgs
  isExpanded: boolean
}) => void

type OnContextMenu = (
  e: MouseEvent,
  value: zed.Value | zed.Type,
  field: zed.Field
) => void

export type InspectorProps = {
  height: number
  width: number
  values: zed.Value[]
  isExpanded: IsExpanded
  setExpanded: SetExpanded
}

export type InspectArgs = {
  ctx: InspectorContext
  value: zed.Value | zed.Type
  field: zed.Field | null
  type: zed.Type
  key: string | null
  last: boolean
  rootValueIndex: number
  rootValueStartIndex: number
}

export type RowData = {
  rootValueIndex: number
  indent: number
  render: ReactNode
}
