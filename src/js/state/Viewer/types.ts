import {TypeDefs} from "@brimdata/zealot"
import {ScrollPosition} from "../../types"

export type ViewerSelectionData = {
  rows: {
    [key: number]: boolean
  }
  currentRange: [number, number]
}
export type ViewerState = {
  columns: TypeDefs
  scrollPos: ScrollPosition
  selection: ViewerSelectionData
}

export type ViewerAction =
  | VIEWER_CLEAR
  | VIEWER_COLUMNS
  | VIEWER_SET_COLUMNS
  | VIEWER_SCROLL
  | VIEWER_SELECT

export type VIEWER_CLEAR = {
  type: "VIEWER_CLEAR"
  tabId?: string
}

export type VIEWER_COLUMNS = {
  type: "VIEWER_COLUMNS"
  columns: TypeDefs
  tabId: string
}

export type VIEWER_SET_COLUMNS = {
  type: "VIEWER_SET_COLUMNS"
  columns: TypeDefs
  tabId: string
}

export type VIEWER_SCROLL = {
  type: "VIEWER_SCROLL"
  scrollPos: ScrollPosition
}

export type VIEWER_SELECT = {
  type: "VIEWER_SELECT"
  index: number
}
