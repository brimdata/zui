/* @flow */

import type {Thunk} from "redux-thunk"

import {fetchByMd5, fetchTuplesByUid} from "./correlations"
import {getRightSidebarIsOpen} from "../reducers/view"
import {pushLogDetail} from "../actions"
import Log from "../../models/Log"

export const viewLogDetail = (log: Log): Thunk => (dispatch, getState) => {
  if (getRightSidebarIsOpen(getState())) {
    dispatch(pushLogDetail(log))
    dispatch(fetchTuplesByUid(log))
    dispatch(fetchByMd5(log))
  }
}
