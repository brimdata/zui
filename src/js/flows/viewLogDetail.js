/* @flow */

import type {Thunk} from "redux-thunk"

import {uidSearch} from "./searches/uidSearch"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import interop from "../brim/interop"

export const viewLogDetail = (log: Log): Thunk => (dispatch, getState) => {
  const current = LogDetails.build(getState())

  if (!Log.isSame(log, current)) {
    dispatch(uidSearch(log))
    dispatch(LogDetails.push(interop.logToRecordData(log)))
  }
}
