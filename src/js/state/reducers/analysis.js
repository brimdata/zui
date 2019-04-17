/* @flow */

import type {Descriptor, Tuple} from "../../types"
import type {State} from "./types"
import createReducer from "./createReducer"

export type Analysis = {
  descriptor: Descriptor,
  tuples: Tuple[]
}

const initialState = {
  descriptor: [],
  tuples: []
}

export default createReducer(initialState, {
  ANALYSIS_CLEAR: () => ({...initialState}),
  ANALYSIS_SET: (state, {descriptor, tuples}) => ({
    descriptor,
    tuples: [...state.tuples, ...tuples]
  })
})

export const getAnalysis = (state: State) => {
  return state.analysis
}
