/* @flow */
import type {TabState} from "../tab/types"
import activeTabSelect from "../tab/activeTabSelect"

export default {
  getRecords: activeTabSelect((tab: TabState) => tab.chart.records),
  getStatus: activeTabSelect((tab: TabState) => tab.chart.status),
  isFetching: (tab: TabState) => tab.chart.status === "FETCHING"
}
