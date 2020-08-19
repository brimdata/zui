/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"

export default function submitAutoRefreshSearch(): Thunk {
  return function(dispatch, getState) {
    const state = getState()
    const prevArgs = Search.getArgs(state)
    console.log("prevArgs: ", prevArgs)
    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const tabId = Tabs.getActive(state)
    const args = Search.getArgs(state)
    console.log("args: ", args)

    switch (args.type) {
      case "analytics":
      case "zoom":
        return dispatch(executeTableSearch(tabId, args, true))
      default:
        dispatch(executeHistogramSearch(tabId, args, prevArgs))
        return dispatch(executeTableSearch(tabId, args, true))
    }
  }
}
