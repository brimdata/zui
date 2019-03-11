/* @flow */

import type {Thunk} from "../reducers/types"
import {clearAnalysis} from "./analysis"
import {clearLogs, receiveLogTuples} from "./logs"
import {getInnerTimeWindow, getOuterTimeWindow} from "../reducers/timeWindow"
import {getMainSearchRequest} from "../reducers/mainSearch"
import {getSearchProgram} from "../selectors/searchBar"
import {getStarredLogs} from "../reducers/starredLogs"
import {issueBoomSearch} from "./boomSearches"
import {pushSearchHistory} from "./searchHistory"
import {updateTab} from "../actions/view"
import {validateProgram} from "./searchBar"
import ParallelSearch from "../models/ParallelSearch"
import SearchFactory from "../models/searches/SearchFactory"
import serially from "../lib/serially"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({
  saveToHistory = true
}: Options = {}): Thunk => (dispatch, getState) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))
  if (saveToHistory) dispatch(pushSearchHistory())
  if (starredSearch(state)) return showStarred(state, dispatch)

  // --
  dispatch(clearLogs())
  dispatch(clearAnalysis())

  const program = getSearchProgram(state)
  const innerSpan = getInnerTimeWindow(state)
  const outerSpan = getOuterTimeWindow(state)
  const searches = SearchFactory.createAll(program, innerSpan, outerSpan)
  searches.forEach(search => dispatch(issueBoomSearch(search)))
}

const starredSearch = state => {
  return getSearchProgram(state) === ":starred"
}

export const killMainSearch = (): Thunk => (dispatch, getState) => {
  const request = getMainSearchRequest(getState())
  request && request.kill()
}

const showStarred = serially(
  (state, dispatch) => {
    const starredLogs = getStarredLogs(state)
    dispatch(requestMainSearch(new ParallelSearch(dispatch, [])))
    return setTimeout(() => {
      dispatch(receiveLogTuples([...starredLogs]))
      dispatch(completeMainSearch())
    })
  },
  id => clearTimeout(id)
)

export function requestMainSearch(request: ParallelSearch) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    request
  }
}

export function spliceMainSearchEvents(index: number) {
  return {
    type: "LOGS_SPLICE",
    index
  }
}

export function completeMainSearch() {
  return {
    type: "MAIN_SEARCH_COMPLETE"
  }
}

export function appendMainSearchQueryProgram(fragment: string) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}

export const clearMainSearch = () => ({
  type: "MAIN_SEARCH_CLEAR"
})
