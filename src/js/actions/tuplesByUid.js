/* @flow */

import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {discoverDescriptors} from "./descriptors"
import Log from "../models/Log"
import type {Tuple} from "../models/Log"
import type {Thunk} from "redux-thunk"

export const clearTuplesByUid = () => ({
  type: "TUPLES_BY_UID_CLEAR"
})

export const addTuplesByUid = (uid: string, tuples: Tuple[]) => ({
  type: "TUPLES_BY_UID_ADD",
  uid,
  tuples
})

export const requestTuplesByUid = (uid: string) => ({
  type: "TUPLES_BY_UID_REQUEST",
  uid
})

export const fetchTuplesByUid = (log: Log): Thunk => (
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

  dispatch(requestTuplesByUid(uid))
  api
    .search({
      space,
      string,
      timeWindow
    })
    .channel(0, ({type, results}) => {
      if (type === "SearchResult") {
        const {tuples} = results
        dispatch(addTuplesByUid(uid, tuples))
        dispatch(discoverDescriptors(tuples))
      }
    })
    .error(e => e)
}
