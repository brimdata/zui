/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import {buildLogDetail} from "./logDetails"
import {getCorrelations} from "../reducers/correlations"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "../reducers/descriptors"
import {toFront} from "../lib/Array"
import CorrelationAccessor from "../models/CorrelationAccessor"
import Log from "../models/Log"
import get from "lodash/get"

export const buildCorrelations = createSelector<State, void, *, *>(
  getCorrelations,
  correlations => new CorrelationAccessor(correlations)
)

export const buildCorrelatedLogs = createSelector<State, void, *, *, *, *, *>(
  buildLogDetail,
  buildCorrelations,
  getDescriptors,
  getCurrentSpaceName,
  (log, correlations, descriptors, space) => {
    if (!log) return []
    const tuples = correlations.get(log.id(), "uid") || []
    const findConn = log => log.get("_path") === "conn"
    const logs = Log.buildAll(tuples, descriptors, space)

    return toFront(Log.sort(logs, "ts"), findConn)
  }
)

export const getLogCorrelations = createSelector<State, void, *, *, *, *, *>(
  buildLogDetail,
  getCorrelations,
  getDescriptors,
  getCurrentSpaceName,
  (log, correlations, descriptors, space) => {
    if (!log) return null
    const rels = get(correlations, log.id(), {})

    return {
      uid: buildUidLogs(get(rels, "uid", []), descriptors, space),
      md5: Log.build(get(rels, "md5", {tuples: []}))
    }
  }
)

const buildUidLogs = (tuples, descriptors, space) => {
  const findConn = log => log.get("_path") === "conn"
  const logs = Log.buildAll(tuples, descriptors, space)
  return toFront(Log.sort(logs, "ts"), findConn)
}
