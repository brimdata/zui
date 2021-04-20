import {ZedPrimitive, ZedRecord} from "zealot/zed"
import MergeHash from "../../models/MergeHash"
import UniqArray from "../../models/UniqArray"
import {SearchStatus} from "../../types/searches"
import {ChartData, CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  appendRecords: (tabId: string, records: ZedRecord[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    data: histogramFormat(records),
    tabId
  }),
  clear: (tabId?: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId})
}

function histogramFormat(records: ZedRecord[]): ChartData {
  const paths = new UniqArray()
  const table = new MergeHash()

  records.forEach((r) => {
    const [ts, path, count] = r.fields.map((f) => f.data) as ZedPrimitive[]

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
