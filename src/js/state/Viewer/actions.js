/* @flow */

import type {Descriptors, ScrollPosition} from "../../types"
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

export default {
  clear(tabId: string): VIEWER_CLEAR {
    return {type: "VIEWER_CLEAR", tabId}
  },

  splice(tabId: string, index: number): VIEWER_SPLICE {
    return {type: "VIEWER_SPLICE", index, tabId}
  },

  setStatus(tabId: string, status: SearchStatus): VIEWER_STATUS {
    return {type: "VIEWER_STATUS", status, tabId}
  },

  setEndStatus(tabId: string, status: ViewerStatus): VIEWER_END_STATUS {
    return {type: "VIEWER_END_STATUS", status, tabId}
  },

  appendRecords(tabId: string, records: RecordData[]): VIEWER_RECORDS {
    return {type: "VIEWER_RECORDS", records, tabId}
  },

  setStats(tabId: string, stats: ViewerStats): VIEWER_STATS {
    return {type: "VIEWER_STATS", stats, tabId}
  },

  updateColumns(tabId: string, desc: Descriptors): VIEWER_COLUMNS {
    return {
      type: "VIEWER_COLUMNS",
      columns: hashDescriptorKeys(desc),
      tabId
    }
  },

  setScroll(scrollPos: ScrollPosition) {
    return {type: "VIEWER_SCROLL", scrollPos}
  },

  setColumnHeadersView(view: string) {
    return {type: "VIEWER_SET_COLUMN_HEADERS", view}
  }
}
