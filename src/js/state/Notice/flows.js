/* @flow */
import {NetworkError, SearchError} from "../../models/Errors"
import type {Thunk} from "../types"
import Notice from "./"

export default {
  clearNetworkError: (): Thunk => (dispatch, getState) => {
    let e = Notice.getError(getState())
    if (e instanceof NetworkError) dispatch(Notice.dismiss())
  },
  clearSearchError: (): Thunk => (dispatch, getState) => {
    let e = Notice.getError(getState())
    if (e instanceof SearchError) dispatch(Notice.dismiss())
  }
}
