/* @flow */

import type {CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"
import {isString} from "../../lib/is"
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
    let [ts, path, count] = r
    if (isString(ts) && isString(path) && isString(count)) {
      let key = new Date(ts).getTime()
      hash.merge(key, {[path]: parseInt(count)})
    }
  })

  return {
    table: hash.toJSON(),
    keys: keys.toArray()
  }
}
