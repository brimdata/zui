/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import Log from "../models/Log"
import type {Descriptor, Tuple} from "../models/Log"
import type {State} from "./types"

export type Analysis = {
  [number]: {
    descriptor: Descriptor,
    tuples: Tuple[]
  }
}

const initialState = {}

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: () => ({}),
  ANALYSIS_SET: (state, {id, descriptor, tuples}) => {
    return {
      ...state,
      [id]: {
        descriptor,
        tuples: mergeTuples(state, id, tuples)
      }
    }
  }
})

const mergeTuples = (state, id, tuples) => {
  if (state[id]) {
    return [...state[id].tuples, ...tuples]
  } else {
    return tuples
  }
}

export const getAnalysis = (state: State) => {
  return state.analysis
}

export const getLogs = createSelector(
  getAnalysis,
  data => {
    if (data && data[0]) {
      const {descriptor, tuples} = data[0]
      return tuples.map(t => new Log(t, descriptor))
    } else {
      return []
    }
  }
)
