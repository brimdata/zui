import {createSelector} from "reselect"

import {State} from "../types"
import {TabState} from "../Tab/types"
import {toHistory} from "./reducer"
import activeTabSelect from "../Tab/activeTabSelect"
import {LogDetailsState, LogDetails} from "./types"
import LogDetailHistory from "src/js/models/LogDetailHistory"
import {SearchStatus} from "src/js/types/searches"
import {zng} from "zealot"
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

const build = createSelector<State, History, zng.Record | null>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    if (entry && entry.log) {
      return zng.Record.deserialize(entry.log)
    } else {
      return null
    }
  }
)

const getUidLogs = createSelector<State, History, zng.Record[]>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    return entry
      ? entry.uidLogs.map((data) => zng.Record.deserialize(data))
      : []
  }
)

const getUidStatus = createSelector<State, History, SearchStatus>(
  getHistory,
  (history) => {
    const entry = history.getCurrent()
    return entry ? entry.uidStatus : "INIT"
  }
)

const getConnLog = createSelector<State, zng.Record[], zng.Record | null>(
  getUidLogs,
  (uids) => {
    return uids.find((log) => log.try("_path")?.toString() === "conn")
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
