import {zed} from "@brimdata/zealot"
import MergeHash from "../../models/MergeHash"
import UniqArray from "../../models/UniqArray"
import {SearchStatus} from "../../types/searches"
import {
  ChartData,
  CHART_CLEAR,
  CHART_RECORDS,
  CHART_SET_SEARCH_KEY,
  CHART_STATUS
} from "./types"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  setRecords: (tabId: string, records: zed.Record[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    data: histogramFormat(records),
    tabId
  }),
  clear: (tabId?: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId}),
  setSearchKey: (tabId: string, key: string): CHART_SET_SEARCH_KEY => ({
    type: "CHART_SET_SEARCH_KEY",
    tabId,
    key
  })
}

function histogramFormat(records: zed.Record[]): ChartData {
  const paths = new UniqArray()
  const table = new MergeHash()

  records.forEach((r) => {
    const [ts, path, count] = r.fields.map((f) => f.data) as [
      zed.Time,
      zed.String,
      zed.Uint64
    ]

    try {
      const pathName = path.toString()
      const key = ts.toDate().getTime()
      const val = {[path.toString()]: count.toInt()}

      table.merge(key, val)
      paths.push(pathName)
    } catch (e) {
      console.log("Error rendering histogram: " + e.toString())
    }
  })

  return {
    table: table.toJSON(),
    keys: paths.toArray()
  }
}
