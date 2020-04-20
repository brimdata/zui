/* @flow */
import type {ChartActions, ChartState} from "./types"
import {uniq} from "../../lib/Array"

let init = {data: {keys: [], table: {}}, status: "INIT"}

export default function reducer(
  state: ChartState = init,
  action: ChartActions
) {
  switch (action.type) {
    case "CHART_RECORDS":
      return {...state, data: merge(state.data, action.data)}
    case "CHART_STATUS":
      return {...state, status: action.status}
    case "CHART_CLEAR":
      return {...init}
    default:
      return state
  }
}

function merge(a, b) {
  return {
    keys: uniq<string>(a.keys.concat(b.keys)),
    // $FlowFixMe fixed in 0.115.0
    table: {...a.table, ...b.table}
  }
}
