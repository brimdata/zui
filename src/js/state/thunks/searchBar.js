/* @flow */

import {PARALLEL_PROC, getProcNames} from "../../lib/ast"
import type {Thunk} from "../reducers/types"
import {
  backSearchHistory,
  errorSearchBarParse,
  forwardSearchHistory,
  setInnerTimeWindow,
  submittingSearchBar
} from "../actions"
import {fetchMainSearch} from "./mainSearch"
import {getCurrentEntry} from "../reducers/searchHistory"
import {getSearchProgram} from "../selectors/searchBar"
import {parse} from "../../lib/Program"
import {restoreSearch} from "./searchHistory"

export const goBack = (): Thunk => (dispatch, getState) => {
  dispatch(backSearchHistory())
  dispatch(restoreSearch(getCurrentEntry(getState())))
  dispatch(fetchMainSearch({saveToHistory: false}))
}

export const goForward = (): Thunk => (dispatch, getState) => {
  dispatch(forwardSearchHistory())
  dispatch(restoreSearch(getCurrentEntry(getState())))
  dispatch(fetchMainSearch({saveToHistory: false}))
}

export const submitSearchBar = (): Thunk => (dispatch) => {
  dispatch(submittingSearchBar())
  dispatch(setInnerTimeWindow(null))
  dispatch(fetchMainSearch())
}

export const validateProgram = (): Thunk => (dispatch, getState) => {
  const [ast, error] = parse(getSearchProgram(getState()))
  if (error) {
    dispatch(errorSearchBarParse(error.message))
    return false
  }

  if (getProcNames(ast).includes(PARALLEL_PROC)) {
    dispatch(
      errorSearchBarParse("Parallel procs are not supported in the app viewer.")
    )
    return false
  }
  return true
}
