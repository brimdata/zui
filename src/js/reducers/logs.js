/* @flow */

import type {State} from "./types"
import type {Tuple} from "../types"
import createReducer from "./createReducer"

export type Logs = {
  tuples: Tuple[]
}

const initialState = {
  tuples: []
}

export default createReducer(initialState, {
  LOGS_CLEAR: state => ({
    ...state,
    tuples: []
  }),

  LOGS_RECEIVE: (state, {tuples}) => ({
    ...state,
    tuples: [...state.tuples, ...tuples]
  }),

  LOGS_SPLICE: (state, {index}) => {
    const tuples = [...state.tuples]
    tuples.splice(index)
    return {
      ...state,
      tuples
    }
  }
})

export const getLogTuples = (state: State) => {
  return state.logs.tuples
}
