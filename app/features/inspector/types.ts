import {MouseEvent, ReactNode} from "react"
import {zed} from "@brimdata/zealot"

export type IsExpanded = (v: zed.Value | zed.Type) => boolean
export type SetExpanded = (v: zed.Value | zed.Type, b: boolean) => void

export type Context = {
  indent: number
  nest: () => void
  unnest: () => void
  isExpanded: IsExpanded
  setExpanded: SetExpanded
  rows: RowData[]
  push: (render: ReactNode) => void
  onContextMenu: (
    e: MouseEvent,
    value: zed.Value | zed.Type,
    field: zed.Field
  ) => void
}

export type InspectArgs = {
  ctx: Context
  value: zed.Value | zed.Type
  field: zed.Field | null
  type: zed.Type
  key: string | null
  last: boolean
}

export type RowData = {
  indent: number
  render: ReactNode
}
