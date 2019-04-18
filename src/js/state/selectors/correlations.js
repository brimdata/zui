/* @flow */

import {createSelector} from "reselect"
import get from "lodash/get"

import type {State} from "../reducers/types"
import {buildLogDetail} from "./logDetails"
import {getCorrelations} from "../reducers/correlations"
import {toFront} from "../../lib/Array"
import Log from "../../models/Log"

export const getLogCorrelations = createSelector<State, void, *, *, *, *, *>(
  buildLogDetail,
  getCorrelations,
  (log, correlations) => {
    if (!log) return {}
    const rels = get(correlations, log.id(), {})

    return {
      uid: uidOrder(get(rels, "uid", [])),
      md5: get(rels, "md5", []),
      tx: get(rels, "tx", []),
      rx: get(rels, "rx", []),
      filenames: get(rels, "filenames", [])
    }
  }
)

const uidOrder = (logs: Log[]) => {
  const findConn = (log) => log.get("_path") === "conn"
  return toFront(Log.sort(logs, "ts"), findConn)
}
