/* @flow */

import type {Thunk} from "../reducers/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../models/searches/programs"
import {getTimeWindow} from "../reducers/timeWindow"
import {issueSearch} from "../../searches/issueSearch"
import {parallelizeProcs} from "../../lib/Program"
import Log from "../../models/Log"

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (uid) {
    return dispatch(
      issueSearch({
        name: "UidSearch",
        tag: "detail",
        program: uid,
        span: getTimeWindow(getState())
      })
    )
  }
}

export const fetchByMd5 = (log: Log): Thunk => (dispatch, getState) => {
  let md5 = log.get("md5")

  if (md5) {
    return dispatch(
      issueSearch({
        name: "Md5Search",
        tag: "detail",
        program: parallelizeProcs([
          filenameCorrelation(md5),
          md5Correlation(md5),
          rxHostsCorrelation(md5),
          txHostsCorrelation(md5)
        ]),
        span: getTimeWindow(getState())
      })
    )
  }
}
