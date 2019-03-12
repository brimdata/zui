/* @flow */

import type {Thunk} from "../reducers/types"
import {clearAnalysis} from "./analysis"
import {
  clearBoomSearches,
  issueBoomSearch,
  killBoomSearches
} from "./boomSearches"
import {clearLogs} from "./logs"
import {getInnerTimeWindow, getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import {pushSearchHistory} from "./searchHistory"
import {updateTab} from "../actions/view"
import {validateProgram} from "./searchBar"
import SearchFactory from "../models/searches/SearchFactory"

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

  dispatch(killBoomSearches())
  dispatch(clearLogs())
  dispatch(clearBoomSearches())
  dispatch(clearAnalysis())
  setTimeout(() => {
    const program = getSearchProgram(state)
    const innerSpan = getInnerTimeWindow(state)
    const outerSpan = getOuterTimeWindow(state)
    const searches = SearchFactory.createAll(program, innerSpan, outerSpan)
    searches.forEach(search => dispatch(issueBoomSearch(search)))
  })
}
