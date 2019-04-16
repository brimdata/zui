/* @flow */

import {createSelector} from "reselect"

import type {State} from "../state/reducers/types"
import {
  getLogDetails,
  toHistory,
  getPosition,
  getPrevPosition
} from "../state/reducers/logDetails"
import {getStarredLogs} from "../state/reducers/starredLogs"
import Log from "../models/Log"
import * as Tuple from "../lib/Tuple"

export const getLogDetailHistory = createSelector<State, void, *, *>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

export const getPrevExists = createSelector<State, void, *, *>(
  getLogDetailHistory,
  (history) => history.prevExists()
)

export const getNextExists = createSelector<State, void, *, *>(
  getLogDetailHistory,
  (history) => history.nextExists()
)

export const getIsGoingBack = createSelector<State, void, *, *, *>(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

export const buildLogDetail = createSelector<State, void, *, *>(
  getLogDetailHistory,
  (history) => {
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
