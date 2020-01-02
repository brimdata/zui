/* @flow */
import type {TabState} from "../tab/types"
import Tab from "../tab"

export default {
  getRecords: Tab.select((tab: TabState) => tab.chart.records),
  getStatus: Tab.select((tab: TabState) => tab.chart.status)
}
