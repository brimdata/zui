/* @flow */
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./viewer/config"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import {addHeadProc, hasAnalytics} from "../lib/Program"
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
import chart from "../state/chart"
import executeSearch from "./executeSearch"
import search from "../state/search"

export default function submitSearch(save: boolean = true): Thunk {
  return function(dispatch, getState) {
    dispatch(submittingSearchBar())
    dispatch(search.computeSpan())

    if (!dispatch(validateProgram())) return

    const state = getState()
    if (save) dispatch(recordSearch(getSearchRecord(state)))

    let tab = {
      program: getSearchProgram(state),
      span: search.getSpanAsDates(state),
      spanFocus: search.getSpanFocusAsDates(state),
      space: getCurrentSpaceName(state)
    }

    switch (searchType(tab)) {
      case "analytic":
        dispatch(executeAnalyticsSearch(tab))
        break
      case "zoom":
        dispatch(executeZoomSearch(tab))
        break
      default:
        dispatch(executeLogSearch(tab))
        dispatch(executeHistogramSearch(tab))
    }
  }
}

function executeAnalyticsSearch(tab) {
  return function(dispatch) {
    dispatch(clearViewer())

    let program = addHeadProc(tab.program, ANALYTIC_MAX_RESULTS)
    let tableSearch = brim
      .search(program, tab.span, tab.space)
      .id("Table")
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })
      .end((_, count) => dispatch(setViewerStatus(getTableStatus(count))))

    return dispatch(executeSearch(tableSearch))
  }
}

function executeLogSearch(tab) {
  return function(dispatch) {
    dispatch(clearViewer())

    let program = addHeadProc(tab.program, PER_PAGE)
    let tableSearch = brim
      .search(program, tab.span, tab.space)
      .id("Table")
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })
      .end((_, count) => dispatch(setViewerStatus(getTableStatus(count))))

    return dispatch(executeSearch(tableSearch))
  }
}

function executeZoomSearch(tab) {
  return function(dispatch) {
    dispatch(clearViewer())

    let program = addHeadProc(tab.program, PER_PAGE)
    if (!tab.spanFocus) return // appease flow
    let tableSearch = brim
      .search(program, tab.spanFocus, tab.space)
      .id("Table")
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })
      .end((_, count) => dispatch(setViewerStatus(getTableStatus(count))))

    return dispatch(executeSearch(tableSearch))
  }
}

function executeHistogramSearch(tab) {
  return function(dispatch) {
    dispatch(chart.clear())

    let program = addEveryCountProc(tab.program, tab.span)
    let histogram = brim
      .search(program, tab.span, tab.space)
      .id("Histogram")
      .status((status) => dispatch(chart.setStatus(status)))
      .chunk((records) => dispatch(chart.appendRecords(records)))

    return dispatch(executeSearch(histogram))
  }
}

function searchType({program, spanFocus}) {
  if (hasAnalytics(program)) return "analytic"
  else if (spanFocus) return "zoom"
  else return "log"
}

function getTableStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
