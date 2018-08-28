import createReducer from "./createReducer"
import {createSelector} from "reselect"
import {getTuplesByUid} from "./eventsByUid"
import {getDescriptors} from "./broSchemas"
import {getCurrentSpaceName} from "./spaces"
import Log from "../models/Log"

const initialState = null

export default createReducer(initialState, {
  LOG_DETAIL_SET: (state, {tuple, descriptor}) => ({tuple, descriptor}),
  LOG_DETAIL_UNSET: () => null
})

export const getLogDetail = state => state.logDetail

export const buildLogDetail = createSelector(getLogDetail, logDetail => {
  if (logDetail) {
    return new Log(logDetail.tuple, logDetail.descriptor)
  } else {
    return null
  }
})

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
