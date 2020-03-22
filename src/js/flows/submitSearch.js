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

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    let prevArgs = Search.getArgs(getState())
    dispatch(SearchBar.submittingSearchBar())
    dispatch(Tab.computeSpan())
    if (!dispatch(SearchBar.validate())) return

    const state = getState()

    if (save) {
      let record = Search.getRecord(state)
      let ts = brim.time().toTs()
      dispatch(History.push(record, ts))
      globalDispatch(Investigation.push(record, ts))
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
