/* @flow */

import {PARALLEL_PROC, getProcNames} from "../../lib/ast"
import type {Thunk} from "../types"
import {
  backSearchHistory,
  errorSearchBarParse,
  forwardSearchHistory,
  submittingSearchBar
} from "../actions"
import {createError} from "../errors"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import {getCurrentEntry} from "../reducers/searchHistory"
import {getSearchProgram} from "../selectors/searchBar"
import {parse} from "../../lib/Program"
import {restoreSearch} from "./searchHistory"

export const goBack = (): Thunk => (dispatch, getState) => {
  dispatch(backSearchHistory())
  dispatch(restoreSearch(getCurrentEntry(getState())))
  dispatch(submitSearchBar(false))
}

export const goForward = (): Thunk => (dispatch, getState) => {
  dispatch(forwardSearchHistory())
  dispatch(restoreSearch(getCurrentEntry(getState())))
  dispatch(submitSearchBar(false))
}

export const submitSearchBar = (save: boolean = true): Thunk => (dispatch) => {
  dispatch(submittingSearchBar())
  dispatch(fetchMainSearch({saveToHistory: save}))
}

export const validateProgram = (): Thunk => (dispatch, getState) => {
  const [ast, error] = parse(getSearchProgram(getState()))
  if (error) {
    dispatch(createError(error))
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
