/* @flow */

import type {Thunk} from "../reducers/types"
import {cancelBoomSearches, issueBoomSearch} from "./boomSearches"
import {clearResults} from "../results/actions"
import {getInnerTimeWindow, getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import {getSearchRecord} from "../selectors/searchRecord"
import {recordSearch} from "../actions"
import {updateTab} from "./view"
import {validateProgram} from "./searchBar"
import SearchFactory from "../../models/searches/SearchFactory"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({
  saveToHistory = true
}: Options = {}): Thunk => (dispatch, getState) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))

  if (saveToHistory) {
    dispatch(recordSearch(getSearchRecord(state)))
  }

  dispatch(cancelBoomSearches("viewer"))
  dispatch(clearResults())

  const program = getSearchProgram(state)
  const innerSpan = getInnerTimeWindow(state)
  const outerSpan = getOuterTimeWindow(state)
  const searches = SearchFactory.createAll(program, innerSpan, outerSpan)

  searches.forEach((search) => dispatch(issueBoomSearch(search, "viewer")))
}
