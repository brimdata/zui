/* @flow */

import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {discoverDescriptors} from "./descriptors"
import Log from "../models/Log"
import type {Thunk} from "redux-thunk"

const receiveCorrelatedLogs = (uid, tuples) => ({
  type: "CORRELATED_LOGS_RECEIVE",
  uid,
  tuples
})

const requestCorrelatedLogs = uid => ({
  type: "CORRELATED_LOGS_REQUEST",
  uid
})

export const errorCorrelatedLogs = (uid: string, error: string) => ({
  type: "CORRELATED_LOGS_ERROR",
  uid,
  error
})

export const fetchCorrelatedLogs = (log: Log): Thunk => (
  dispatch,
  getState,
  api
) => {
  let uid = log.correlationId()
  if (!uid) return
  const state = getState()
  const timeWindow = getTimeWindow(state)
  const space = getCurrentSpaceName(state)
  const string = `${uid} | head 500`

  dispatch(requestCorrelatedLogs(uid))
  api
    .search({
      space,
      string,
      timeWindow
    })
    .channel(0, ({type, results}) => {
      if (type === "SearchResult") {
        const {tuples} = results
        dispatch(receiveCorrelatedLogs(uid, tuples))
        dispatch(discoverDescriptors(tuples))
      }
    })
    .error(e => dispatch(errorCorrelatedLogs(uid, e)))
}
