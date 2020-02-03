/* @flow */

import type {CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"
import {toDate} from "../../lib/TimeField"
import MergeHash from "../../models/MergeHash"
import UniqArray from "../../models/UniqArray"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  appendRecords: (tabId: string, records: RecordData[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    data: histogramFormat(records),
    tabId
  }),
  clear: (tabId: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId})
}

function histogramFormat(records) {
  let keys = new UniqArray()
  let hash = new MergeHash()

  records.forEach((r) => {
    let ts = toDate(r[0].value || "0").getTime()
    let path = r[1].value || ""
    let count = parseInt(r[2].value)
    keys.push(path)
    hash.merge(ts, {[path]: count})
  })

  return {
    table: hash.toJSON(),
    keys: keys.toArray()
  }
}
