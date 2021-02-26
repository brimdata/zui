import tabHistory from "app/router/tab-history"
import brim from "../../brim"
import {PARALLEL_PROC} from "../../brim/ast"
import {parse} from "../../lib/Program"
import Errors from "../Errors"
import SearchBar from "../SearchBar"
import {Thunk} from "../types"

export default {
  goBack: (): Thunk => (dispatch) => {
    dispatch(tabHistory.goBack())
  },

  goForward: (): Thunk => (dispatch) => {
    dispatch(tabHistory.goForward())
  },

  validate: (): Thunk<boolean> => (dispatch, getState) => {
    const [ast, error] = parse(SearchBar.getSearchProgram(getState()))
    if (error) {
      dispatch(Errors.createError(error))
      dispatch(SearchBar.errorSearchBarParse(error.message))
      return false
    }

    if (brim.ast(ast).proc(PARALLEL_PROC)) {
      dispatch(
        SearchBar.errorSearchBarParse(
          "Parallel procs are not yet supported in Brim."
        )
      )
      return false
    }
    return true
  }
}
