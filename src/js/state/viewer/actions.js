/* @flow */

import type {
  VIEWER_CLEAR,
  VIEWER_LOGS,
  VIEWER_SPLICE,
  VIEWER_STATUS,
  ViewerStatus
} from "./types"
import Log from "../../models/Log"

export function clearViewer(): VIEWER_CLEAR {
  return {type: "VIEWER_CLEAR"}
}

export function spliceViewer(index: number): VIEWER_SPLICE {
  return {type: "VIEWER_SPLICE", index}
}

export function setViewerStatus(status: ViewerStatus): VIEWER_STATUS {
  return {type: "VIEWER_STATUS", status}
}

export function appendViewerLogs(logs: Log[]): VIEWER_LOGS {
  return {type: "VIEWER_LOGS", logs}
}
