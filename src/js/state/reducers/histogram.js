/* @flow */

import type {State} from "./types"
import Log from "../../models/Log"
import createReducer from "./createReducer"

const initialState = {
  logs: []
}

export type Histogram = {
  logs: Log[]
}

export default createReducer(initialState, {
  HISTOGRAM_CLEAR: () => ({
    ...initialState
  }),
  HISTOGRAM_SEARCH_RESULT: (state, {data}) => ({
    ...state,
    logs: data
  })
})

export function getHistogramData(state: State) {
  return state.histogram.logs
}
