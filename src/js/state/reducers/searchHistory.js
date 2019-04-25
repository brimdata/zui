/* @flow */

import {createSelector} from "reselect"

import type {SearchRecord} from "../../types"
import type {State} from "../types"
import NavHistory from "../../models/NavHistory"
import createReducer from "./createReducer"

export type SearchHistory = {
  position: number,
  entries: SearchRecord[]
}

const initialState: SearchHistory = {
  position: -1,
  entries: []
}

export default createReducer(initialState, {
  SEARCH_HISTORY_CLEAR: () => ({
    ...initialState
  }),
  SEARCH_HISTORY_PUSH: (state, {entry}) => {
    const history = new NavHistory<SearchRecord>(state)
    history.push(entry)
    return history.toJSON()
  },
  SEARCH_HISTORY_BACK: (state) => {
    const history = new NavHistory<SearchRecord>(state)
    history.goBack()
    return history.toJSON()
  },
  SEARCH_HISTORY_FORWARD: (state) => {
    const history = new NavHistory<SearchRecord>(state)
    history.goForward()
    return history.toJSON()
  }
})

export const getSearchHistory = (state: State) => {
  return state.searchHistory
}

export const buildSearchHistory = createSelector<State, void, *, *>(
  getSearchHistory,
  (state) => {
    return new NavHistory<SearchRecord>(state)
  }
)

export const getCurrentEntry = createSelector<State, void, SearchRecord, *>(
  buildSearchHistory,
  (history) => {
    return history.getCurrentEntry()
  }
)

export const canGoBack = createSelector<State, void, *, *>(
  buildSearchHistory,
  (history) => {
    return history.canGoBack()
  }
)

export const canGoForward = createSelector<State, void, *, *>(
  buildSearchHistory,
  (history) => {
    return history.canGoForward()
  }
)
