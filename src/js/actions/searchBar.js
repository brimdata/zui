/* @flow */

import {fetchMainSearch} from "./mainSearch"
import {setInnerTimeWindow} from "./timeWindow"
import {getSearchProgram} from "../reducers/searchBar"
import * as Program from "../lib/Program"
import Field from "../models/Field"

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

export const submitSearchBar = () => (dispatch: Function) => {
  dispatch(submittingSearchBar())
  dispatch(setInnerTimeWindow(null))
  dispatch(fetchMainSearch())
}

export const validateProgram = () => (
  dispatch: Function,
  getState: Function
) => {
  const [, error] = Program.parse(getSearchProgram(getState()))
  if (error) {
    dispatch(errorSearchBarParse(error.message))
    return false
  } else {
    return true
  }
}
