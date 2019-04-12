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
  COUNT_BY_TIME_CLEAR: () => ({
    ...initialState
  }),
  COUNT_BY_TIME_RECEIVE: (state, {data: {descriptor, tuples}}) => ({
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
