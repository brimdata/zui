/* @flow */

import Log from "../../models/Log"

export type ViewerStatus = "INCOMPLETE" | "COMPLETE" | "LIMIT"

export type ViewerState = {|
  logs: Log[],
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
