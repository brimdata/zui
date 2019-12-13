/* @flow */
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {getSearchRecord} from "../state/selectors/searchRecord"
import {recordSearch, submittingSearchBar} from "../state/actions"
import {validateProgram} from "../state/thunks/searchBar"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"
import search from "../state/search"
import searchArgs from "./searchArgs"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    dispatch(submittingSearchBar())
    dispatch(search.computeSpan())

    if (!dispatch(validateProgram())) return

    const state = getState()
    if (save) dispatch(recordSearch(getSearchRecord(state)))
    let tab = search.getTab(state)
    dispatch(clearViewer())

    switch (searchArgs.type(tab)) {
      case "analytic":
        dispatch(executeTableSearch(searchArgs.analytics(tab)))
        break
      case "zoom":
        dispatch(executeTableSearch(searchArgs.zoom(tab)))
        break
      default:
        dispatch(executeTableSearch(searchArgs.events(tab)))
        dispatch(executeHistogramSearch(tab))
    }
  }
}
