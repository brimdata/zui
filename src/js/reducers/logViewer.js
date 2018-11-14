/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  moreAhead: false,
  moreBehind: false,
  isFetchingAhead: false,
  isFetchingBehind: false
}

export type LogViewer = typeof initialState

export default createReducer(initialState, {
  SEARCH_BAR_SUBMIT: () => ({...initialState}),
  LOG_VIEWER_MORE_AHEAD_SET: (state, {value}) => ({
    ...state,
    moreAhead: value
  }),
  LOG_VIEWER_MORE_BEHIND_SET: (state, {value}) => ({
    ...state,
    moreBehind: value
  }),
  LOG_VIEWER_IS_FETCHING_BEHIND_SET: (state, {value}) => ({
    ...state,
    isFetchingBehind: value
  }),
  LOG_VIEWER_IS_FETCHING_AHEAD_SET: (state, {value}) => ({
    ...state,
    isFetchingAhead: value
  })
})

export const moreAhead = (state: State) => {
  return state.logViewer.moreAhead
}

export const moreBehind = (state: State) => {
  return state.logViewer.moreBehind
}

export const isFetchingAhead = (state: State) => {
  return state.logViewer.isFetchingAhead
}

export const isFetchingBehind = (state: State) => {
  return state.logViewer.isFetchingBehind
}
