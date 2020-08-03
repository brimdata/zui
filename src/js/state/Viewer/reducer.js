/* @flow */

import type {ViewerAction, ViewerState} from "./types"
import {concat, splice} from "../../lib/Array"

const init: ViewerState = {
  records: [],
  endStatus: "INCOMPLETE",
  status: "INIT",
  columns: {},
  scrollPos: {x: 0, y: 0}
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
    case "VIEWER_COLUMNS":
      return {...state, columns: {...state.columns, ...action.columns}}
    case "VIEWER_SCROLL":
      return {...state, scrollPos: action.scrollPos}
    default:
      return state
  }
}
