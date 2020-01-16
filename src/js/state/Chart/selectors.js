/* @flow */

import type {TabState} from "../Tab/types"
import activeTabSelect from "../Tab/activeTabSelect"

export default {
  getRecords: activeTabSelect((tab: TabState) => tab.chart.records),
  getStatus: activeTabSelect((tab: TabState) => tab.chart.status),
  isFetching: (tab: TabState) => tab.chart.status === "FETCHING"
}
