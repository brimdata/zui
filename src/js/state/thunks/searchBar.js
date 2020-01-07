/* @flow */

import {PARALLEL_PROC} from "../../brim/ast"
import type {Thunk} from "../types"
import {createError} from "../errors"
import {errorSearchBarParse} from "../actions"
import {getSearchProgram} from "../selectors/searchBar"
import {parse} from "../../lib/Program"
import {restoreSearch} from "./searchHistory"
import History from "../history"
import brim from "../../brim"
import submitSearch from "../../flows/submitSearch"

export const goBack = (): Thunk => (dispatch, getState) => {
  dispatch(History.back())
  dispatch(restoreSearch(History.current(getState())))
  dispatch(submitSearch(false))
}

export const goForward = (): Thunk => (dispatch, getState) => {
  dispatch(History.forward())
  dispatch(restoreSearch(History.current(getState())))
  dispatch(submitSearch(false))
}

export const validateProgram = (): Thunk => (dispatch, getState) => {
  const [ast, error] = parse(getSearchProgram(getState()))
  if (error) {
    dispatch(createError(error))
    dispatch(errorSearchBarParse(error.message))
    return false
  }

  if (brim.ast(ast).proc(PARALLEL_PROC)) {
    dispatch(
      errorSearchBarParse("Parallel procs are not supported in the app viewer.")
    )
    return false
  }
  return true
}
