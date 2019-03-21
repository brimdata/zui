/* @flow */

import type {Thunk} from "redux-thunk"

import type {Tuple} from "../types"
import {getTimeWindow} from "../reducers/timeWindow"
import {issueBoomSearch} from "./boomSearches"
import Log from "../models/Log"
import UidSearch from "../models/searches/UidSearch"

export const clearTuplesByUid = () => ({
  type: "TUPLES_BY_UID_CLEAR"
})

export const addTuplesByUid = (uid: string, tuples: Tuple[]) => ({
  type: "TUPLES_BY_UID_ADD",
  uid,
  tuples
})

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (!uid) return
  return dispatch(
    issueBoomSearch(new UidSearch(uid, getTimeWindow(getState())), "detail")
  )
}
