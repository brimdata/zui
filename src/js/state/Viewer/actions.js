/* @flow */

import type {RecordData} from "../../types/records"
import type {ScrollPosition} from "../../types"
import type {SearchStatus} from "../../types/searches"
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

  updateColumns(tabId: string, columns: ViewerColumns): VIEWER_COLUMNS {
    return {
      type: "VIEWER_COLUMNS",
      columns,
      tabId
    }
  },

  setScroll(scrollPos: ScrollPosition): VIEWER_SCROLL {
    return {type: "VIEWER_SCROLL", scrollPos}
  },

  select(index: number): VIEWER_SELECT {
    return {type: "VIEWER_SELECT", index}
  },

  selectMulti(index: number): VIEWER_SELECT_MULTI {
    return {type: "VIEWER_SELECT_MULTI", index}
  },

  selectRange(index: number): VIEWER_SELECT_RANGE {
    return {type: "VIEWER_SELECT_RANGE", index}
  }
}
