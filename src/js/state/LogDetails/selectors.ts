import {createSelector} from "reselect"
import {SearchStatus} from "src/js/types/searches"
import activeTabSelect from "../Tab/activeTabSelect"
import {TabState} from "../Tab/types"
import {State} from "../types"
import {LogDetailHistory, toHistory} from "./reducer"
import {LogDetailsState} from "./types"

import {zed, decode} from "@brimdata/zealot"

const getLogDetails = activeTabSelect((state: TabState) => {
  return state.logDetails
})

const getHistory = createSelector<State, LogDetailsState, LogDetailHistory>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

const build = createSelector<State, LogDetailHistory, zed.Record | null>(
  getHistory,
  (history) => {
    const entry = history.current()
    if (entry && entry.log) {
      return decode(entry.log)
    } else {
      return null
    }
  }
)

const getUidLogs = createSelector<State, LogDetailHistory, zed.Record[]>(
  getHistory,
  (history) => {
    const entry = history.current()
    return entry ? entry.uidLogs.map((data) => decode(data)) : []
  }
)

const getUidStatus = createSelector<State, LogDetailHistory, SearchStatus>(
  getHistory,
  (history) => {
    const entry = history.current()
    return entry ? entry.uidStatus : "INIT"
  }
)

const getConnLog = createSelector<State, zed.Record[], zed.Record | null>(
  getUidLogs,
  (uids) => {
    return uids.find((log) => log.try("_path")?.toString() === "conn")
  }
)

export default {
  getConnLog,
  getUidStatus,
  getUidLogs,
  build,
  getHistory
}
