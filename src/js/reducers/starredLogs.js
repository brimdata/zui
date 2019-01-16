/* @flow */

import createReducer from "./createReducer"
import * as Tuple from "../lib/Tuple"

const initialState = []

export default createReducer(initialState, {
  STARRED_LOGS_CLEAR: () => initialState,
  LOG_STAR: (state, {tuple}) => [...state, tuple],
  LOG_UNSTAR: (state, {tuple}) => Tuple.removeFrom(state, tuple)
})

export const getStarredLogs = (state: Object) => state.starredLogs
