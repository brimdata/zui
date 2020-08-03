/* @flow */
import produce from "immer"

import type {ViewerAction, ViewerState} from "./types"
import {concat, splice} from "../../lib/Array"

const init: ViewerState = {
  records: [],
  endStatus: "INCOMPLETE",
  status: "INIT",
  columns: {},
  scrollPos: {x: 0, y: 0},
  selection: {
    rows: {},
    currentRange: [0, 0]
  }
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
    case "VIEWER_SELECT":
      return produce(state, (draft) => {
        draft.selection.rows = {}
        draft.selection.currentRange = [action.index, action.index]
        writeRange(draft, true)
      })
    case "VIEWER_SELECT_MULTI":
      return produce(state, (draft) => {
        draft.selection.currentRange = [action.index, action.index]
        writeRange(draft, true)
      })
    case "VIEWER_SELECT_RANGE":
      return produce(state, (draft) => {
        writeRange(draft, false)
        draft.selection.currentRange[1] = action.index
        writeRange(draft, true)
      })
    default:
      return state
  }
}

function writeRange(draft, value) {
  const [from, to] = draft.selection.currentRange.slice().sort()
  for (let i = from; i <= to; ++i) draft.selection.rows[i] = value
}
