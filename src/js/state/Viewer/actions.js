/* @flow */

import type {RecordData} from "../../types/records"
import type {ScrollPosition} from "../../types"
import type {SearchStatus} from "../../types/searches"
import type {Thunk} from "../types"
import type {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_END_STATUS,
  VIEWER_RECORDS,
  VIEWER_SCROLL,
  VIEWER_SELECT,
  VIEWER_SELECT_MULTI,
  VIEWER_SELECT_RANGE,
  VIEWER_SPLICE,
  VIEWER_STATUS,
  ViewerColumns,
  ViewerStatus
} from "./types"
import Viewer from "./"

export const clear = (tabId: string): VIEWER_CLEAR => {
  return {type: "VIEWER_CLEAR", tabId}
}

export const splice = (tabId: string, index: number): VIEWER_SPLICE => {
  return {type: "VIEWER_SPLICE", index, tabId}
}

export const setStatus = (
  tabId: string,
  status: SearchStatus
): VIEWER_STATUS => {
  return {type: "VIEWER_STATUS", status, tabId}
}

export const setEndStatus = (
  tabId: string,
  status: ViewerStatus
): VIEWER_END_STATUS => {
  return {type: "VIEWER_END_STATUS", status, tabId}
}

export const appendRecords = (
  tabId: string,
  records: RecordData[]
): VIEWER_RECORDS => {
  return {type: "VIEWER_RECORDS", records, tabId}
}

export const updateColumns = (
  tabId: string,
  columns: ViewerColumns
): VIEWER_COLUMNS => {
  return {
    type: "VIEWER_COLUMNS",
    columns,
    tabId
  }
}

export const setScroll = (scrollPos: ScrollPosition): VIEWER_SCROLL => {
  return {type: "VIEWER_SCROLL", scrollPos}
}

export const select = (index: number): VIEWER_SELECT => {
  return {type: "VIEWER_SELECT", index}
}

export const selectMulti = (index: number): VIEWER_SELECT_MULTI => {
  return {type: "VIEWER_SELECT_MULTI", index}
}

export const selectRange = (index: number): VIEWER_SELECT_RANGE => {
  return {type: "VIEWER_SELECT_RANGE", index}
}

export const selectRangeNext = () => ({
  type: "VIEWER_SELECT_RANGE_NEXT"
})

export const selectRangePrev = () => ({
  type: "VIEWER_SELECT_RANGE_PREV"
})

export const selectNext = () => ({
  type: "VIEWER_SELECT_NEXT"
})

export const selectPrev = () => ({
  type: "VIEWER_SELECT_PREV"
})

export const selectAll = () => ({
  type: "VIEWER_SELECT_ALL"
})
