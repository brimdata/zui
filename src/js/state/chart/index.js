/* @flow */
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"
import type {TabState} from "../tab/types"
import reducer from "./reducer"
import tab from "../tab"

export type ChartState = {
  records: RecordData[],
  status: SearchStatus
}

const actions = {
  setStatus: (status: SearchStatus) => ({type: "CHART_STATUS", status}),
  appendRecords: (records: RecordData[]) => ({type: "CHART_RECORDS", records}),
  clear: () => ({type: "CHART_CLEAR"})
}

const selectors = {
  getRecords: tab.select((tab: TabState) => tab.chart.records),
  getStatus: tab.select((tab: TabState) => tab.chart.status)
}

export default {...actions, ...selectors, reducer}
