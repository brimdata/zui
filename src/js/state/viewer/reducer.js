/* @flow */

import type {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_END_STATUS,
  VIEWER_RECORDS,
  VIEWER_SPLICE,
  VIEWER_STATS,
  VIEWER_STATUS,
  ViewerState
} from "./types"
import {concat, splice} from "../../lib/Array"

type Action =
  | VIEWER_CLEAR
  | VIEWER_SPLICE
  | VIEWER_STATUS
  | VIEWER_RECORDS
  | VIEWER_COLUMNS
  | VIEWER_END_STATUS
  | VIEWER_STATS

const init = {
  records: [],
  endStatus: "INCOMPLETE",
  status: "INIT",
  columns: {},
  stats: {updateTime: 0, startTime: 0, bytesRead: 0}
}

export default function(
  state: ViewerState = init,
  action: Action
): ViewerState {
  switch (action.type) {
    case "VIEWER_RECORDS":
      return {...state, records: concat(state.records, action.records)}
    case "VIEWER_CLEAR":
      return {...init}
    case "VIEWER_SPLICE":
      return {...state, records: splice(state.records, action.index)}
    case "VIEWER_END_STATUS":
      return {...state, endStatus: action.status}
    case "VIEWER_STATUS":
      return {...state, status: action.status}
    case "VIEWER_STATS":
      return {...state, stats: action.stats}
    case "VIEWER_COLUMNS":
      return {...state, columns: {...state.columns, ...action.columns}}
    default:
      return state
  }
}
