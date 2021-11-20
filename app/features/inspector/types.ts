import {MouseEvent} from "react"
import {zed} from "zealot"
import {ReactNode} from "react"

export type IsExpanded = (v: zed.AnyValue) => boolean
export type SetExpanded = (v: zed.AnyValue, b: boolean) => void

export type Context = {
  isExpanded: IsExpanded
  setExpanded: SetExpanded
  rows: RowData[]
  push: (render: ReactNode, indent: number) => void
  onContextMenu: (e: MouseEvent, value: zed.AnyValue, field: zed.Field) => void
}

export type RowData = {
  indent: number
  render: ReactNode
}
