/* @flow */

import type {Thunk} from "../state/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../searches/programs"
import {getTimeWindow} from "../state/reducers/timeWindow"
import {issueSearch} from "../searches/issueSearch"
import {parallelizeProcs} from "../lib/Program"
import Log from "../models/Log"

export const UID_CORRELATION_LIMIT = 100

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (uid) {
    return dispatch(
      issueSearch({
        name: "UidSearch",
        tag: "detail",
        program: uid + " | head " + UID_CORRELATION_LIMIT,
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
