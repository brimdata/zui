/* @flow */

import type {LogCorrelations} from "../types"
import type {State} from "./types"
import createReducer from "./createReducer"

export type Correlations = {
  [string]: LogCorrelations
}
const initialState = {}

export default createReducer(initialState, {
  CORRELATION_SET: (state, {key, name, data}) => ({
    ...state,
    [key]: {
      ...state[key],
      [name]: data
    }
  }),

  CORRELATIONS_CLEAR: (state, {key}) => ({
    ...state,
    [key]: undefined
  }),

  CORRELATIONS_CLEAR_ALL: () => ({...initialState})
})

export const getCorrelations = (state: State) => state.correlations
