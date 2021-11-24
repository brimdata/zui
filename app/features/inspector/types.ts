import {MouseEvent, ReactNode} from "react"
import {zed} from "zealot"

export type IsExpanded = (v: zed.AnyValue | zed.ZedTypeInterface) => boolean
export type SetExpanded = (
  v: zed.AnyValue | zed.ZedTypeInterface,
  b: boolean
) => void

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
    value: zed.AnyValue | zed.ZedTypeInterface,
    field: zed.Field
  ) => void
}

export type InspectArgs = {
  ctx: Context
  value: zed.AnyValue | zed.ZedTypeInterface
  field: zed.Field | null
  type: zed.ZedTypeInterface
  key: string | null
  last: boolean
}

export type RowData = {
  indent: number
  render: ReactNode
}
