/* @flow */
import type {RecordData} from "../../types/records"
import type {ReturnType} from "../../types"
import type {SearchStatus} from "../../types/searches"
import type {State} from "../types"
import {concat} from "../../lib/Array"

export type ChartState = {
  records: RecordData[],
  status: SearchStatus
}
type ChartAction = ReturnType<typeof actions.appendRecords>

const actions = {
  setStatus: (status: SearchStatus) => ({type: "CHART_STATUS", status}),
  appendRecords: (records: RecordData[]) => ({type: "CHART_RECORDS", records}),
  clear: () => ({type: "CHART_CLEAR"})
}

const selectors = {
  getRecords: (state: State) => state.chart.records,
  getStatus: (state: State) => state.chart.status
}

let init = {records: [], status: "INIT"}

function reducer(state: ChartState = init, action: ChartAction) {
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

export default {...actions, ...selectors, reducer}
