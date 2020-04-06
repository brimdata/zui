/* @flow */

import type {LogDetails, LogDetailsAction, LogDetailsState} from "./types"
import LogDetailHistory from "../../models/LogDetailHistory"

const init = (): LogDetailsState => ({
  entries: [],
  position: 0,
  prevPosition: -1
})

export default function reducer(
  state: LogDetailsState = init(),
  action: LogDetailsAction
): LogDetailsState {
  let history
  switch (action.type) {
    case "LOG_DETAIL_PUSH":
      history = toHistory(state)
      history.save({log: action.record, uidLogs: [], uidStatus: "INIT"})
      return {
        entries: history.entries,
        position: history.position,
        prevPosition: state.position
      }
    case "LOG_DETAIL_UPDATE":
      history = toHistory(state)
      history.updateCurrent(action.updates)
      return {
        entries: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    case "LOG_DETAIL_FORWARD":
      history = toHistory(state)
      history.goForward()
      return {
        entries: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    case "LOG_DETAIL_BACK":
      history = toHistory(state)
      history.goBack()
      return {
        entries: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    default:
      return state
  }
}

export const toHistory = ({entries, position}: LogDetailsState) => {
  return new LogDetailHistory<LogDetails>([...entries], position)
}
