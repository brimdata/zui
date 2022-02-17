import {zed} from "@brimdata/zealot"
import React, {MouseEvent, ReactNode} from "react"
import {InspectContext} from "./inspect-list"

export type IsExpanded = (v: zed.Value | zed.Type) => boolean
export type SetExpanded = (payload: {
  args: InspectArgs
  isExpanded: boolean
}) => void

type InspectorMouseEvent = (
  e: MouseEvent,
  value: zed.Value | zed.Type,
  field: zed.Field,
  index: number
) => void

export type InspectorProps = {
  height: number
  width: number
  values: zed.Value[]
  isExpanded: IsExpanded
  setExpanded: SetExpanded
  onContextMenu?: InspectorMouseEvent
  onClick?: InspectorMouseEvent
  loadMore?: Function
  innerRef?: React.Ref<any>
}

export type InspectArgs = {
  ctx: InspectContext
  value: zed.Value | zed.Type
  field: zed.Field | null
  type: zed.Type
  key: string | null
  last: boolean
  index: number
}

export type RowData = {
  indent: number
  render: ReactNode
}
