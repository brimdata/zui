/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"
import type {TimeWindow} from "./timeWindow"
import type {SearchBar} from "./searchBar"
import NavHistory from "../models/NavHistory"
import {createSelector} from "reselect"

type Entry = {
  searchBar: SearchBar,
  timeWindow: TimeWindow
}

export type SearchHistory = {
  position: number,
  entries: Entry[]
}

const initialState: SearchHistory = {
  position: -1,
  entries: []
}

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) => {
    const history = new NavHistory(state)
    history.push(entry)
    return history.toJSON()
  },
  SEARCH_HISTORY_BACK: state => {
    const history = new NavHistory(state)
    history.goBack()
    return history.toJSON()
  },
  SEARCH_HISTORY_FORWARD: state => {
    const history = new NavHistory(state)
    history.goForward()
    return history.toJSON()
  }
})

export const getSearchHistory = (state: State) => {
  return state.searchHistory
}

export const buildSearchHistory = createSelector(
  getSearchHistory,
  state => {
    return new NavHistory(state)
  }
)

export const getCurrentEntry = createSelector(
  buildSearchHistory,
  history => {
    return history.getCurrentEntry()
  }
)

export const pickEntryOffState = (state: State) => {
  return {
    searchBar: state.searchBar,
    timeWindow: state.timeWindow
  }
}

export const canGoBack = createSelector(
  buildSearchHistory,
  history => {
    return history.canGoBack()
  }
)

export const canGoForward = createSelector(
  buildSearchHistory,
  history => {
    return history.canGoForward()
  }
)
