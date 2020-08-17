/* @flow */

import type {Thunk} from "redux-thunk"

import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import executeUidSearch from "./executeUidSearch"
import interop from "../brim/interop"

export const viewLogDetail = (log: Log): Thunk => (dispatch, getState) => {
  const current = LogDetails.build(getState())

  if (!Log.isSame(log, current)) {
    dispatch(executeUidSearch(log))
    dispatch(LogDetails.push(interop.logToRecordData(log)))
  }
}
