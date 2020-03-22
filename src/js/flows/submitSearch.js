/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import History from "../state/History"
import Investigation from "../state/Investigation"
import Notice from "../state/Notice"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"

export default function submitSearch(
  save: boolean = true,
  ts: Date = new Date()
): Thunk {
  return function(dispatch, getState) {
    let time = brim.time(ts)
    let prevArgs = Search.getArgs(getState())
    dispatch(SearchBar.submittingSearchBar(ts))
    dispatch(Tab.computeSpan())
    if (!dispatch(SearchBar.validate())) return

    const state = getState()

    if (save) {
      let record = Search.getRecord(state)
      dispatch(History.push(record, time.toTs()))
      globalDispatch(Investigation.push(record, time.toTs()))
    }
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
