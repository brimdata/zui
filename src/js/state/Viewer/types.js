/* @flow */

import type {Descriptor} from "../../types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"

export type ViewerStatus = "FETCHING" | "INCOMPLETE" | "COMPLETE" | "LIMIT"

export type ViewerColumns = {[string]: Descriptor}
export type ViewerStats = {
  updateTime: number,
  startTime: number,
  bytesRead: number
}
export type ViewerState = {|
  records: RecordData[],
  columns: ViewerColumns,
  endStatus: ViewerStatus,
  status: SearchStatus,
  stats: ViewerStats
|}

export type ViewerAction =
  | VIEWER_SCROLL_TO_MIDDLE
  | VIEWER_CLEAR
  | VIEWER_SPLICE
  | VIEWER_STATUS
  | VIEWER_RECORDS
  | VIEWER_COLUMNS
  | VIEWER_END_STATUS
  | VIEWER_STATS

export type VIEWER_SCROLL_TO_MIDDLE = {
  type: "VIEWER_SCROLL_TO_MIDDLE",
  doScroll: boolean
}

export type VIEWER_RECORDS = {
  type: "VIEWER_RECORDS",
  records: RecordData[],
  tabId: string
}

export type VIEWER_CLEAR = {
  type: "VIEWER_CLEAR",
  tabId: string
}

export type VIEWER_SPLICE = {
  type: "VIEWER_SPLICE",
  index: number,
  tabId: string
}

export type VIEWER_END_STATUS = {
  type: "VIEWER_END_STATUS",
  status: ViewerStatus,
  tabId: string
}

export type VIEWER_STATUS = {
  type: "VIEWER_STATUS",
  status: SearchStatus,
  tabId: string
}

export type VIEWER_COLUMNS = {
  type: "VIEWER_COLUMNS",
  columns: ViewerColumns,
  tabId: string
}

export type VIEWER_STATS = {
  type: "VIEWER_STATS",
  stats: ViewerStats,
  tabId: string
}
