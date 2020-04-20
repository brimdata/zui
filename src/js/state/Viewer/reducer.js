/* @flow */

import type {ViewerAction, ViewerState} from "./types"
import {concat, splice} from "../../lib/Array"

const init: ViewerState = {
  records: [],
  endStatus: "INCOMPLETE",
  status: "INIT",
  columns: {},
  stats: {updateTime: 0, startTime: 0, bytesRead: 0}
}

export default function(
  state: ViewerState = init,
  action: ViewerAction
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
      // $FlowFixMe fixed in 0.115.0
      return {...state, columns: {...state.columns, ...action.columns}}
    default:
      return state
  }
}
