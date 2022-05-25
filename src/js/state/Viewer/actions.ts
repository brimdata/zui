import {TypeDefs} from "@brimdata/zealot/query/channel"
import {ScrollPosition} from "../../types"
import {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_SCROLL,
  VIEWER_SELECT,
  VIEWER_SET_COLUMNS,
} from "./types"

export const clear = (tabId?: string): VIEWER_CLEAR => {
  return {type: "VIEWER_CLEAR", tabId}
}

export const updateColumns = (
  tabId: string,
  columns: TypeDefs
): VIEWER_COLUMNS => {
  return {
    type: "VIEWER_COLUMNS",
    columns,
    tabId,
  }
}

export const setColumns = (
  tabId: string,
  columns: TypeDefs
): VIEWER_SET_COLUMNS => {
  return {
    type: "VIEWER_SET_COLUMNS",
    columns,
    tabId,
  }
}

export const setScroll = (scrollPos: ScrollPosition): VIEWER_SCROLL => {
  return {type: "VIEWER_SCROLL", scrollPos}
}

export const select = (index: number): VIEWER_SELECT => {
  return {type: "VIEWER_SELECT", index}
}
