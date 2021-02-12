import {TabState} from "../Tab/types"
import activeTabSelect from "../Tab/activeTabSelect"
import History from "app/core/models/history"
import {SearchRecord} from "src/js/types"

export default {
  prev: (state: TabState) => state.history.entries[state.history.position - 1],
  current: (state: TabState) => state.history.entries[state.history.position],
  canGoBack: (state: TabState) =>
    History.parse<SearchRecord>(state.history).canGoBack(),
  canGoForward: (state: TabState) =>
    History.parse<SearchRecord>(state.history).canGoForward(),
  first: activeTabSelect((state: TabState) => state.history.entries[0]),
  count: activeTabSelect((state: TabState) => state.history.entries.length)
}
