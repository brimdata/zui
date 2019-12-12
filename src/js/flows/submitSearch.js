/* @flow */
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./viewer/config"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import {addHeadProc, hasAnalytics} from "../lib/Program"
import {
  appendViewerRecords,
  clearViewer,
  setViewerEndStatus,
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
        dispatch(executeTableSearch(analyticsArgs(tab)))
        break
      case "zoom":
        dispatch(executeTableSearch(zoomArgs(tab)))
        break
      default:
        dispatch(executeTableSearch(eventArgs(tab)))
        dispatch(executeHistogramSearch(tab))
    }
  }
}

function analyticsArgs(tab) {
  return {
    program: addHeadProc(tab.program, ANALYTIC_MAX_RESULTS),
    span: tab.span,
    space: tab.space
  }
}

function zoomArgs(tab) {
  return {
    program: addHeadProc(tab.program, PER_PAGE),
    span: tab.spanFocus || [new Date(), new Date()], // Appease flow
    space: tab.space
  }
}

function eventArgs(tab) {
  return {
    program: addHeadProc(tab.program, PER_PAGE),
    span: tab.span,
    space: tab.space
  }
}

function executeTableSearch({program, span, space}) {
  return function(dispatch) {
    dispatch(clearViewer())

    let table = brim
      .search(program, span, space)
      .id("Table")
      .status((status) => dispatch(setViewerStatus(status)))
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })
      .end((_id, count) => dispatch(setViewerEndStatus(endStatus(count))))

    return dispatch(executeSearch(table))
  }
}

function executeHistogramSearch({program, span, space}) {
  return function(dispatch) {
    dispatch(chart.clear())
    let histogram = brim
      .search(addEveryCountProc(program, span), span, space)
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

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
