/* @flow */

import type {Thunk} from "redux-thunk"

import Log from "../models/Log"
import LogDetails from "../state/LogDetails"

export const viewLogDetail = (log: Log): Thunk => (dispatch) => {
  dispatch(LogDetails.pushLogDetail(log))
}
