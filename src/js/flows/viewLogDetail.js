/* @flow */

import type {Thunk} from "redux-thunk"

import {pushLogDetail} from "../state/actions"
import Log from "../models/Log"

export const viewLogDetail = (log: Log): Thunk => (dispatch) => {
  dispatch(pushLogDetail(log))
}
