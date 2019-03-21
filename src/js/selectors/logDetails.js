/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import {buildCorrelations} from "./correlations"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "../reducers/descriptors"
import {
  getLogDetails,
  toHistory,
  getPosition,
  getPrevPosition
} from "../reducers/logDetails"
import {getStarredLogs} from "../reducers/starredLogs"
import Log from "../models/Log"
import * as Tuple from "../lib/Tuple"

export const getLogDetailHistory = createSelector<State, void, *, *>(
  getLogDetails,
  logDetails => toHistory(logDetails)
)

export const getPrevExists = createSelector<State, void, *, *>(
  getLogDetailHistory,
  history => history.prevExists()
)

export const getNextExists = createSelector<State, void, *, *>(
  getLogDetailHistory,
  history => history.nextExists()
)

export const getIsGoingBack = createSelector<State, void, *, *, *>(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

export const buildLogDetail = createSelector<State, void, *, *>(
  getLogDetailHistory,
  history => {
    const log = history.getCurrent()
    return log ? new Log(log.tuple, log.descriptor) : null
  }
)

export const getLogDetailIsStarred = createSelector<State, void, *, *, *>(
  buildLogDetail,
  getStarredLogs,
  (log, starred) => {
    return log ? Tuple.contains(starred, log.tuple) : false
  }
)

export const buildCorrelatedLogs = createSelector<State, void, *, *, *, *, *>(
  buildLogDetail,
  buildCorrelations,
  getDescriptors,
  getCurrentSpaceName,
  (log, correlations, descriptors, space) => {
    if (!log) return []
    const tuples = correlations.get(log.id(), "uid") || []
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
