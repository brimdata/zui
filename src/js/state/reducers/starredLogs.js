/* @flow */

import {removeFrom} from "../../lib/Tuple"
import createReducer from "./createReducer"

const initialState = []

export default createReducer(initialState, {
  STARRED_LOGS_CLEAR: () => initialState,
  LOG_STAR: (state, {tuple}) => [...state, tuple],
  LOG_UNSTAR: (state, {tuple}) => removeFrom(state, tuple)
})

export const getStarredLogs = (state: Object) => state.starredLogs
