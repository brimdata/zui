import {createSelector} from "reselect"

import {RecordData} from "../../types/records"
import {State} from "../types"
import {TabState} from "../Tab/types"
import {toHistory} from "./reducer"
import Log from "../../models/Log"
import activeTabSelect from "../Tab/activeTabSelect"
import brim from "../../brim"
import interop from "../../brim/interop"
import {LogDetailsState, LogDetails} from "./types"
import LogDetailHistory from "src/js/models/LogDetailHistory"
import {SearchStatus} from "src/js/types/searches"

type History = LogDetailHistory<LogDetails>

const getLogDetails = activeTabSelect((state: TabState) => {
  return state.logDetails
})

const getPosition = activeTabSelect((state: TabState) => {
  return state.logDetails.position
})

const getPrevPosition = activeTabSelect((state: TabState) => {
  return state.logDetails.prevPosition
})

const getHistory = createSelector<State, LogDetailsState, History>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

const getPrevExists = createSelector<State, History, boolean>(
  getHistory,
  (history) => history.prevExists()
)

const getNextExists = createSelector<State, History, boolean>(
  getHistory,
  (history) => history.nextExists()
)

const getIsGoingBack = createSelector<State, number, number, boolean>(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

const build = createSelector<State, History, Log | null>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    if (entry && entry.log) {
      const record = brim.record(entry.log)
      return interop.recordToLog(record)
    } else {
      return null
    }
  }
)

const getUidLogs = createSelector<State, History, RecordData[]>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    return entry ? entry.uidLogs : []
  }
)

const getUidStatus = createSelector<State, History, SearchStatus>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    return entry ? entry.uidStatus : "INIT"
  }
)

const getConnLog = createSelector<State, RecordData[], Log | null>(
  getUidLogs,
  (uids) => {
    return uids
      .map(brim.record)
      .map(brim.interop.recordToLog)
      .find((log) => log.getString("_path") === "conn")
  }
)

export default {
  getConnLog,
  getUidStatus,
  getUidLogs,
  getLogDetails,
  getPosition,
  getPrevPosition,
  build,
  getIsGoingBack,
  getNextExists,
  getPrevExists,
  getHistory
}
