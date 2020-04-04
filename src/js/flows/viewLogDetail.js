/* @flow */

import type {Thunk} from "redux-thunk"

import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import interop from "../brim/interop"

export const viewLogDetail = (log: Log): Thunk => (dispatch) => {
  dispatch(LogDetails.push(interop.logToRecordData(log)))
}
