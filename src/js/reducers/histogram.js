/* @flow */

import type {State} from "./types"
import createReducer from "./createReducer"

const initialState = {
  data: {
    tuples: [],
    descriptor: []
  },
  error: null
}

export type Histogram = typeof initialState

export default createReducer(initialState, {
  HISTOGRAM_CLEAR: () => ({
    ...initialState
  }),
  HISTOGRAM_SEARCH_RESULT: (state, {data: {descriptor, tuples}}) => ({
    ...state,
    data: {
      descriptor,
      tuples: [...state.data.tuples, ...tuples]
    }
  })
})

export function getHistogramData(state: State) {
  return state.histogram.data
}
