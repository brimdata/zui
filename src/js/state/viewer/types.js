/* @flow */

import type {Descriptor} from "../../types"
import Log from "../../models/Log"

export type ViewerStatus = "INCOMPLETE" | "COMPLETE" | "LIMIT"

export type ViewerColumns = {[string]: Descriptor}

export type ViewerState = {|
  logs: Log[],
  columns: ViewerColumns,
  status: ViewerStatus
|}

export type VIEWER_LOGS = {
  type: "VIEWER_LOGS",
  logs: Log[]
}

export type VIEWER_CLEAR = {
  type: "VIEWER_CLEAR"
}

export type VIEWER_SPLICE = {
  type: "VIEWER_SPLICE",
  index: number
}

export type VIEWER_STATUS = {
  type: "VIEWER_STATUS",
  status: ViewerStatus
}

export type VIEWER_COLUMNS = {
  type: "VIEWER_COLUMNS",
  columns: ViewerColumns
}
