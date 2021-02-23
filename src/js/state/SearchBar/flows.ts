import {PARALLEL_PROC} from "../../brim/ast"
import {Thunk} from "../types"
import {parse} from "../../lib/Program"
import Errors from "../Errors"
import SearchBar from "../SearchBar"
import brim from "../../brim"

export default {
  goBack: (): Thunk => () => {
    global.tabHistory.goBack()
  },

  goForward: (): Thunk => () => {
    global.tabHistory.goForward()
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
