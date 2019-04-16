/* @flow */

import type {State} from "./types"
import type {Tuple} from "../types"
import createReducer from "./createReducer"

export type Logs = {
  tuples: Tuple[],
  spliceIndex: number
}

const initialState = {
  tuples: [],
  spliceIndex: 0
}

export default createReducer(initialState, {
  LOGS_CLEAR: (state) => ({
    ...state,
    tuples: []
  }),

  LOGS_RECEIVE: (state, {tuples}) => ({
    ...state,
    tuples: [...state.tuples, ...tuples]
  }),

  LOGS_SPLICE_INDEX_SET: (state, {index}) => ({
    ...state,
    spliceIndex: index
  }),

  LOGS_SPLICE: (state) => {
    const tuples = [...state.tuples]
    tuples.splice(state.spliceIndex)
    return {
      ...state,
      tuples
    }
  }
})

export const getLogTuples = (state: State) => {
  return state.logs.tuples
}
