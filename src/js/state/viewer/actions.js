/* @flow */

import type {Descriptors} from "../../types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"
import type {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_END_STATUS,
  VIEWER_RECORDS,
  VIEWER_SPLICE,
  VIEWER_STATS,
  VIEWER_STATUS,
  ViewerStats,
  ViewerStatus
} from "./types"
import {hashDescriptorKeys} from "./hashDescriptorKeys"

export function clearViewer(tabId: string): VIEWER_CLEAR {
  return {type: "VIEWER_CLEAR", tabId}
}

export function spliceViewer(tabId: string, index: number): VIEWER_SPLICE {
  return {type: "VIEWER_SPLICE", index, tabId}
}

export function setViewerStatus(
  tabId: string,
  status: SearchStatus
): VIEWER_STATUS {
  return {type: "VIEWER_STATUS", status, tabId}
}

export function setViewerEndStatus(
  tabId: string,
  status: ViewerStatus
): VIEWER_END_STATUS {
  return {type: "VIEWER_END_STATUS", status, tabId}
}

export function appendViewerRecords(
  tabId: string,
  records: RecordData[]
): VIEWER_RECORDS {
  return {type: "VIEWER_RECORDS", records, tabId}
}

export function setViewerStats(
  tabId: string,
  stats: ViewerStats
): VIEWER_STATS {
  return {type: "VIEWER_STATS", stats, tabId}
}

export function updateViewerColumns(
  tabId: string,
  desc: Descriptors
): VIEWER_COLUMNS {
  return {
    type: "VIEWER_COLUMNS",
    columns: hashDescriptorKeys(desc),
    tabId
  }
}
