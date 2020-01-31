/* @flow */
import type {Thunk} from "../state/types"
import History from "../state/History"
import Notice from "../state/Notice"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    let prevArgs = Search.getArgs(getState())
    dispatch(SearchBar.submittingSearchBar())
    dispatch(Tab.computeSpan())
    if (!dispatch(SearchBar.validate())) return

    const state = getState()

    if (save) dispatch(History.push(Search.getRecord(state)))
    let tabId = Tabs.getActive(state)
    let args = Search.getArgs(state)

    dispatch(Viewer.clear(tabId))
    dispatch(Notice.dismiss())

    switch (args.type) {
      case "analytics":
        dispatch(executeTableSearch(tabId, args))
        break
      case "zoom":
        dispatch(executeTableSearch(tabId, args))
        break
      default:
        dispatch(executeTableSearch(tabId, args))
        dispatch(executeHistogramSearch(tabId, args, prevArgs))
    }
  }
}
