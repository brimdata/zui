/* @flow */

import {createSelector} from "reselect"
import trim from "lodash/trim"

import type {State} from "../types"

export const getSearchBar = (state: State) => {
  return state.searchBar
}

export const getSearchBarInputValue = (state: State) => state.searchBar.current

export const getSearchBarPins = (state: State) => state.searchBar.pinned

export const getSearchBarPreviousInputValue = (state: State) =>
  state.searchBar.previous

export const getSearchBarEditingIndex = (state: State) =>
  state.searchBar.editing

export const getSearchBarError = (state: State) => state.searchBar.error

export const getSearchProgram = createSelector<State, void, *, *, *>(
  getSearchBarPins,
  getSearchBarInputValue,
  (pinned, current) => {
    const program = [...pinned, current].map((s) => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)

export const getPrevSearchProgram = createSelector<State, void, *, *, *>(
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  (pinned, prev) => {
    const program = [...pinned, prev].map((s) => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)
