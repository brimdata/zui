/* @flow */

import {PARALLEL_PROC} from "../../brim/ast"
import type {Thunk} from "../types"
import {parse} from "../../lib/Program"
import Errors from "../Errors"
import History from "../History"
import Search from "../Search"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import brim from "../../brim"
import submitSearch from "../../flows/submitSearch"
import Viewer from "../Viewer"

export default {
  goBack: (): Thunk => (dispatch, getState) => {
    dispatch(History.back())
    const record = Tab.currentEntry(getState())
    dispatch(Search.restore(record))
    dispatch(submitSearch({history: false, investigation: false})).then(() => {
      if (record.scrollPos) dispatch(Viewer.setScroll(record.scrollPos))
    })
  },

  goForward: (): Thunk => (dispatch, getState) => {
    dispatch(History.forward())
    const record = Tab.currentEntry(getState())
    dispatch(Search.restore(record))
    dispatch(submitSearch({history: false, investigation: false})).then(() => {
      if (record.scrollPos) dispatch(Viewer.setScroll(record.scrollPos))
    })
  },

  validate: (): Thunk => (dispatch, getState) => {
    const [ast, error] = parse(SearchBar.getSearchProgram(getState()))
    if (error) {
      dispatch(Errors.createError(error))
      dispatch(SearchBar.errorSearchBarParse(error.message))
      return false
    }

    if (brim.ast(ast).proc(PARALLEL_PROC)) {
      dispatch(
        SearchBar.errorSearchBarParse(
          "Parallel procs are not supported in the app viewer."
        )
      )
      return false
    }
    return true
  }
}
