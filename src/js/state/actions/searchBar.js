/* @flow */

import {PARALLEL_PROC, getProcNames} from "../lib/ast"
import type {SearchBar} from "../reducers/searchBar"
import type {Thunk} from "../reducers/types"
import {
  backSearchHistory,
  forwardSearchHistory,
  restoreSearch
} from "./searchHistory"
import {fetchMainSearch} from "./mainSearch"
import {getCurrentEntry} from "../reducers/searchHistory"
import {getSearchProgram} from "../selectors/searchBar"
import {parse} from "../lib/Program"
import {setInnerTimeWindow} from "./timeWindow"
import Field from "../models/Field"

export const clearSearchBar = () => ({
  type: "SEARCH_BAR_CLEAR"
})

export const restoreSearchBar = (value: SearchBar) => ({
  type: "SEARCH_BAR_RESTORE",
  value
})

export const changeSearchBarInput = (value: string) => ({
  type: "SEARCH_BAR_INPUT_CHANGE",
  value
})

export const pinSearchBar = () => ({
  type: "SEARCH_BAR_PIN"
})

export const editSearchBarPin = (index: number) => ({
  type: "SEARCH_BAR_PIN_EDIT",
  index
})

export const removeSearchBarPin = (index: number) => ({
  type: "SEARCH_BAR_PIN_REMOVE",
  index
})

export const removeAllSearchBarPins = () => ({
  type: "SEARCH_BAR_PIN_REMOVE_ALL"
})

export const setSearchBarPins = (pinned: string[]) => ({
  type: "SEARCH_BAR_PINS_SET",
  pinned
})

export const appendQueryInclude = (field: Field) => ({
  type: "QUERY_INCLUDE_APPEND",
  field
})

export const appendQueryExclude = (field: Field) => ({
  type: "QUERY_EXCLUDE_APPEND",
  field
})

export const appendQueryCountBy = (field: Field) => ({
  type: "QUERY_COUNT_BY_APPEND",
  field
})

export const errorSearchBarParse = (error: string) => ({
  type: "SEARCH_BAR_PARSE_ERROR",
  error
})

export const submittingSearchBar = () => ({
  type: "SEARCH_BAR_SUBMIT"
})

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
