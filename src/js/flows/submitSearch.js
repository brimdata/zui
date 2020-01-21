/* @flow */
import type {Thunk} from "../state/types"
import History from "../state/History"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/viewer"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"
import searchArgs from "./searchArgs"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    dispatch(SearchBar.submittingSearchBar())
    dispatch(Tab.computeSpan())

    if (!dispatch(SearchBar.validate())) return

    const state = getState()
    if (save) dispatch(History.push(Search.getRecord(state)))
    let tabId = Tabs.getActive(state)
    let tabData = {
      program: SearchBar.getSearchProgram(state),
      span: Tab.getSpanAsDates(state),
      spanFocus: Tab.getSpanFocusAsDates(state),
      space: Tab.spaceName(state),
      tabId
    }
    dispatch(Viewer.clear(tabId))

    switch (searchArgs.type(tabData)) {
      case "analytic":
        dispatch(executeTableSearch(searchArgs.analytics(tabData)))
        break
      case "zoom":
        dispatch(executeTableSearch(searchArgs.zoom(tabData)))
        break
      default:
        dispatch(executeTableSearch(searchArgs.events(tabData)))
        dispatch(executeHistogramSearch(tabData))
    }
  }
}
