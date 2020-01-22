/* @flow */

import type {CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  appendRecords: (tabId: string, records: RecordData[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    records,
    tabId
  }),
  clear: (tabId: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId})
}
