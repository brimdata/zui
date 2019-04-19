/* @flow */

import type {Thunk} from "../reducers/types"
import {createMd5Search} from "../../searches/templates/md5Search"
import {createUidSearch} from "../../searches/templates/uidSearch"
import {getTimeWindow} from "../reducers/timeWindow"
import {issueBoomSearch} from "./boomSearches"
import Log from "../../models/Log"

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (uid) {
    let search = createUidSearch(uid, getTimeWindow(getState()))
    return dispatch(issueBoomSearch(search))
  }
}

export const fetchByMd5 = (log: Log): Thunk => (dispatch, getState) => {
  let md5 = log.get("md5")

  if (md5) {
    let search = createMd5Search(md5, getTimeWindow(getState()))
    return dispatch(issueBoomSearch(search))
  }
}
