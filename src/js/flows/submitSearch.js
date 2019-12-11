/* @flow */
import {PER_PAGE} from "./viewer/config"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import {addHeadProc} from "../lib/Program"
import {
  appendViewerRecords,
  clearViewer,
  setViewerStatus,
  updateViewerColumns
} from "../state/viewer/actions"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getSearchRecord} from "../state/selectors/searchRecord"
import {recordSearch, submittingSearchBar} from "../state/actions"
import {validateProgram} from "../state/thunks/searchBar"
import brim from "../brim"
import executeSearch from "./executeSearch"
import search from "../state/search"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    const state = getState()
    dispatch(submittingSearchBar())
    dispatch(search.computeSpan())
    if (!dispatch(validateProgram())) return
    if (save) dispatch(recordSearch(getSearchRecord(state)))

    dispatch(executeTableSearch())
  }
}

function executeTableSearch() {
  return function(dispatch, getState) {
    let state = getState()
    let program = addHeadProc(getSearchProgram(state), PER_PAGE)
    let span = search.getSpanAsDates(state)
    let space = getCurrentSpaceName(state)
    let tableSearch = brim
      .search(program, span, space)
      .id("Table")
      .start(() => dispatch(clearViewer()))
      .status((status) => dispatch(setViewerStatus(status)))
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })

    return dispatch(executeSearch(tableSearch))
  }
}

function executeHistogramSearch() {
  return function(dispatch, getState) {
    let state = getState()
    let span = search.getSpanAsDates(state)
    let program = addEveryCountProc(getSearchProgram(state), span)
    let space = getCurrentSpaceName(state)

    let histogram = brim
      .search(program, span, space)
      .id("Histogram")
      .start(() => dispatch(clearViewer()))
      .status((status) => dispatch(setViewerStatus(status)))
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })

    return dispatch(executeSearch(histogram))
  }
}
