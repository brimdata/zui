/* @flow */

import type {State} from "./types"
import createReducer from "./createReducer"

export type Correlations = {
  [string]: {
    [string]: *
  }
}
const initialState = {}

export default createReducer(initialState, {
  CORRELATION_SET: (state, {key, correlation}) => ({
    ...state,
    [key]: {
      ...state[key],
      [correlation.name]: correlation.data
    }
  }),

  CORRELATIONS_CLEAR: (state, {key}) => ({
    ...state,
    [key]: undefined
  }),

  CORRELATIONS_CLEAR_ALL: () => ({...initialState})
})

export const getCorrelations = (state: State) => state.correlations
