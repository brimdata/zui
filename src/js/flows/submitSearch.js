/* @flow */
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getSearchRecord} from "../state/selectors/searchRecord"
import {recordSearch, submittingSearchBar} from "../state/actions"
import {validateProgram} from "../state/thunks/searchBar"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"
import searchArgs from "./searchArgs"
import tab from "../state/tab"
import tabs from "../state/tabs"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    dispatch(submittingSearchBar())
    dispatch(tab.computeSpan())

    if (!dispatch(validateProgram())) return

    const state = getState()
    if (save) dispatch(recordSearch(getSearchRecord(state)))
    let tabId = tabs.getActive(state)
    let tabData = {
      program: getSearchProgram(state),
      span: tab.getSpanAsDates(state),
      spanFocus: tab.getSpanFocusAsDates(state),
      space: getCurrentSpaceName(state),
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
