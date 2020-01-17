/* @flow */

import type {Thunk} from "../types"
import Boomd from "../Boomd"

export default {
  enableCache: (value: boolean): Thunk => (dispatch, getState, boom) => {
    dispatch(Boomd.useCache(value))
    boom.setOptions({enableCache: value})
  },

  enableIndex: (value: boolean): Thunk => (dispatch, getState, boom) => {
    dispatch(Boomd.useIndex(value))
    boom.setOptions({enableIndex: value})
  }
}
