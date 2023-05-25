import * as zed from "@brimdata/zed-js"
import React, {MouseEvent, ReactNode} from "react"
import {ViewContext} from "../../../zui-kit/core/value-view/view-context"
import {View} from "./views/view"

type InspectorMouseEvent = (
  e: MouseEvent,
  value: zed.Any,
  field: zed.Field
) => void

export type InspectorProps = {
  height: number
  width: number
  values: zed.Value[]
  isExpanded: (key: string) => boolean
  setExpanded: (key: string, value: boolean) => void
  getValuePage: (key: string) => number
  incValuePage: (key: string) => void
  onContextMenu?: InspectorMouseEvent
  onClick?: InspectorMouseEvent
  loadMore?: Function
  innerRef?: React.Ref<any>
  onScroll?: (props: {top: number; left: number}) => void
  initialScrollPosition?: {top: number; left: number}
  customViews?: typeof View[]
  hideKeys?: boolean
  hideSyntax?: boolean
}

export type InspectContextArgs = Pick<
  InspectorProps,
  | "incValuePage"
  | "getValuePage"
  | "setExpanded"
  | "isExpanded"
  | "onClick"
  | "onContextMenu"
  | "customViews"
  | "hideKeys"
  | "hideSyntax"
> & {
  peekLimit?: number
  lineLimit?: number
  rowsPerPage?: number
  rowLimit?: number
}

export type InspectArgs = {
  ctx: ViewContext
  value: zed.Any
  field: zed.Field | null
  type: zed.Type
  // This is the visual name of the key,
  // the field name for records,
  // an array index for arrays,
  // and the key type for a map
  key: string | null | zed.Any
  last: boolean
  indexPath: (number | string)[]
}

export type RowData = {
  indent: number
  render: ReactNode
}

export type RenderMode = "single" | "peek" | "line" | "expanded"
