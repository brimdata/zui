/* @flow */

import {createSelector} from "reselect"
import {getTuplesByUid} from "../reducers/eventsByUid"
import {getDescriptors} from "../reducers/descriptors"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getStarredLogs} from "../reducers/starredLogs"
import {
  getLogDetails,
  toHistory,
  getPosition,
  getPrevPosition
} from "../reducers/logDetails"
import Log from "../models/Log"
import * as Tuple from "../lib/Tuple"

export const getLogDetailHistory = createSelector(
  getLogDetails,
  logDetails => toHistory(logDetails)
)

export const getPrevExists = createSelector(
  getLogDetailHistory,
  history => history.prevExists()
)

export const getNextExists = createSelector(
  getLogDetailHistory,
  history => history.nextExists()
)

export const getIsGoingBack = createSelector(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

export const buildLogDetail = createSelector(
  getLogDetailHistory,
  history => {
    const log = history.getCurrent()
    return log ? new Log(log.tuple, log.descriptor) : null
  }
)

export const getLogDetailIsStarred = createSelector(
  buildLogDetail,
  getStarredLogs,
  (log, starred) => {
    return log ? Tuple.contains(starred, log.tuple) : false
  }
)

export const buildCorrelatedLogs = createSelector(
  buildLogDetail,
  getTuplesByUid,
  getDescriptors,
  getCurrentSpaceName,
  (log, tuplesByUid, descriptors, space) => {
    if (!log) return []

    const uid = log.correlationId()
    if (!uid) return []

    const tuples = tuplesByUid[uid] || []
    const logs = Log.buildAll(tuples, descriptors, space).sort((a, b) =>
      a.get("ts") > b.get("ts") ? 1 : -1
    )
    const connIndex = logs.findIndex(l => l.get("_path") === "conn")
    if (connIndex > 0) {
      const conn = logs[connIndex]
      logs.splice(connIndex, 1)
      logs.unshift(conn)
    }
    return logs
  }
)
