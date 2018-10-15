/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import {getTuplesByUid} from "./eventsByUid"
import {getDescriptors} from "./descriptors"
import {getCurrentSpaceName} from "./spaces"
import {getStarredLogs} from "./starredLogs"
import Log from "../models/Log"
import History from "../models/History"
import * as Tuple from "../lib/Tuple"

const initialState = {
  logs: [],
  position: 0
}

const toHistory = ({logs, position}) => new History(logs, position)
const toState = ({entries, position}) => ({logs: entries, position})

export default createReducer(initialState, {
  LOG_DETAIL_VIEW: (state, {tuple, descriptor}) => {
    const history = toHistory(state)
    history.save({tuple, descriptor})
    return toState(history)
  },
  LOG_DETAIL_BACK: state => {
    const history = toHistory(state)
    history.getPrev()
    return toState(history)
  },
  LOG_DETAIL_FORWARD: state => {
    const history = toHistory(state)
    history.getNext()
    return toState(history)
  }
})

export const getNextExists = (state: Object) =>
  toHistory(state.logDetails).nextExists()

export const getPrevExists = (state: Object) =>
  toHistory(state.logDetails).prevExists()

export const getLogDetail = (state: Object) => {
  const {logs, position} = state.logDetails
  return new History(logs, position).getCurrent()
}

export const buildLogDetail = createSelector(
  getLogDetail,
  log => (log ? new Log(log.tuple, log.descriptor) : null)
)

export const getLogDetailIsStarred = createSelector(
  getLogDetail,
  getStarredLogs,
  (log, starred) => (log ? Tuple.contains(starred, log.tuple) : false)
)

export const buildCorrelatedLogs = createSelector(
  buildLogDetail,
  getTuplesByUid,
  getDescriptors,
  getCurrentSpaceName,
  (log, tuplesByUid, descriptors, space) => {
    if (!log) return []

    const uid = log.cast("uid")
    if (!uid) return []

    const tuples = tuplesByUid[uid] || []
    const logs = Log.buildAll(tuples, descriptors, space).sort(
      (a, b) => (a.get("ts") > b.get("ts") ? 1 : -1)
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
