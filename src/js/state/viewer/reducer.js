/* @flow */

import type {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_LOGS,
  VIEWER_SPLICE,
  VIEWER_STATUS,
  ViewerState
} from "./types"
import {concat, splice} from "../../lib/Array"

type Action =
  | VIEWER_CLEAR
  | VIEWER_SPLICE
  | VIEWER_STATUS
  | VIEWER_LOGS
  | VIEWER_COLUMNS

const init = {
  logs: [],
  status: "INCOMPLETE",
  columns: {}
}

export default function(
  state: ViewerState = init,
  action: Action
): ViewerState {
  switch (action.type) {
    case "VIEWER_LOGS":
      return {...state, logs: concat(state.logs, action.logs)}
    case "VIEWER_CLEAR":
      return {...init}
    case "VIEWER_SPLICE":
      return {...state, logs: splice(state.logs, action.index)}
    case "VIEWER_STATUS":
      return {...state, status: action.status}
    case "VIEWER_COLUMNS":
      return {...state, columns: {...state.columns, ...action.columns}}
    default:
      return state
  }
}
