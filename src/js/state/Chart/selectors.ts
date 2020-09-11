import {TabState} from "../Tab/types"
import activeTabSelect from "../Tab/activeTabSelect"

export default {
  getData: activeTabSelect((tab: TabState) => tab.chart.data),
  getStatus: activeTabSelect((tab: TabState) => tab.chart.status),
  isFetching: (tab: TabState) => tab.chart.status === "FETCHING"
}
