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

export type VIEWER_RECORDS = {
  type: "VIEWER_RECORDS",
  records: RecordData[]
}

export type VIEWER_CLEAR = {
  type: "VIEWER_CLEAR"
}

export type VIEWER_SPLICE = {
  type: "VIEWER_SPLICE",
  index: number
}

export type VIEWER_END_STATUS = {
  type: "VIEWER_END_STATUS",
  status: ViewerStatus
}

export type VIEWER_STATUS = {
  type: "VIEWER_STATUS",
  status: SearchStatus
}

export type VIEWER_COLUMNS = {
  type: "VIEWER_COLUMNS",
  columns: ViewerColumns
}

export type VIEWER_STATS = {
  type: "VIEWER_STATS",
  stats: ViewerStats
}
