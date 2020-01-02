/* @flow */
import type {ChartActions, ChartState} from "./types"
import {concat} from "../../lib/Array"

let init = {records: [], status: "INIT"}

export default function reducer(
  state: ChartState = init,
  action: ChartActions
) {
  switch (action.type) {
    case "CHART_RECORDS":
      return {...state, records: concat(state.records, action.records)}
    case "CHART_STATUS":
      return {...state, status: action.status}
    case "CHART_CLEAR":
      return {...init}
    default:
      return state
  }
}
