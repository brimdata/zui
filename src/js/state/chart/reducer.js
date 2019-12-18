/* @flow */
import type {ChartState} from "./"
import {concat} from "../../lib/Array"

let init = {records: [], status: "INIT"}

export default function reducer(state: ChartState = init, action: *) {
  switch (action.type) {
    case "FUCK":
      return state
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
