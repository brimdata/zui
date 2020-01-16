/* @flow */
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getSearchRecord} from "../state/selectors/searchRecord"
import {submittingSearchBar} from "../state/actions"
import {validateProgram} from "../state/thunks/searchBar"
import History from "../state/History"
import Tab from "../state/Tab"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"
import searchArgs from "./searchArgs"
import tabs from "../state/tabs"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    dispatch(submittingSearchBar())
    dispatch(Tab.computeSpan())

    if (!dispatch(validateProgram())) return

    const state = getState()
    if (save) dispatch(History.push(getSearchRecord(state)))
    let tabId = tabs.getActive(state)
    let tabData = {
      program: getSearchProgram(state),
      span: Tab.getSpanAsDates(state),
      spanFocus: Tab.getSpanFocusAsDates(state),
      space: Tab.spaceName(state),
      tabId
    }
    dispatch(clearViewer(tabId))

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
