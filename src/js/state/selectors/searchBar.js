/* @flow */

import {createSelector} from "reselect"
import trim from "lodash/trim"

import type {SearchBar} from "../reducers/searchBar"
import type {State} from "../types"
import type {TabState} from "../tab/types"
import tabs from "../tabs"

export const getSearchBar = createSelector<State, void, SearchBar, TabState>(
  tabs.getActiveTab,
  (tab) => tab.searchBar
)

export const getSearchBarInputValue = createSelector<
  State,
  void,
  string,
  SearchBar
>(getSearchBar, (searchBar) => searchBar.current)

export const getSearchBarPins = createSelector<
  State,
  void,
  string[],
  SearchBar
>(getSearchBar, (searchBar) => searchBar.pinned)

export const getSearchBarPreviousInputValue = createSelector<
  State,
  void,
  string,
  SearchBar
>(getSearchBar, (searchBar) => searchBar.previous)

export const getSearchBarEditingIndex = createSelector<
  State,
  void,
  number | null,
  SearchBar
>(getSearchBar, (searchBar) => searchBar.editing)

export const getSearchBarError = createSelector<
  State,
  void,
  string | null,
  SearchBar
>(getSearchBar, (searchBar) => searchBar.error)

export const getSearchProgram = createSelector<State, void, *, *, *>(
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  (pinned, prev) => {
    const program = [...pinned, prev].map((s) => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)
