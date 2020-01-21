/* @flow */

import type {LogDetailsAction, LogDetailsState} from "./types"
import LogDetailHistory from "../../models/LogDetailHistory"

const init: LogDetailsState = {
  logs: [],
  position: 0,
  prevPosition: -1
}

export default function reducer(
  state: LogDetailsState = init,
  action: LogDetailsAction
): LogDetailsState {
  let history
  switch (action.type) {
    case "LOG_DETAIL_PUSH":
      history = toHistory(state)
      history.save({tuple: action.tuple, descriptor: action.descriptor})
      return {
        logs: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    case "LOG_DETAIL_FORWARD":
      history = toHistory(state)
      history.goForward()
      return {
        logs: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    case "LOG_DETAIL_BACK":
      history = toHistory(state)
      history.goBack()
      return {
        logs: history.entries,
        position: history.position,
        prevPosition: state.position
      }

    default:
      return state
  }
}

export const toHistory = ({logs, position}: LogDetailsState) => {
  return new LogDetailHistory(logs, position)
}

export const toState = ({entries, position}: LogDetailHistory) => {
  return {logs: entries, position}
}
