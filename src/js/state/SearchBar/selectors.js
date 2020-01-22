/* @flow */

import {createSelector} from "reselect"

import type {SearchBarState} from "./types"
import type {State} from "../types"
import type {TabState} from "../Tab/types"
import {trim} from "../../lib/Str"
import Tabs from "../Tabs"

export const getSearchBar = createSelector<
  State,
  void,
  SearchBarState,
  TabState
>(Tabs.getActiveTab, (tab) => tab.searchBar)

export const getSearchBarInputValue = createSelector<
  State,
  void,
  string,
  SearchBarState
>(getSearchBar, (searchBar) => searchBar.current)

export const getSearchBarPins = createSelector<
  State,
  void,
  string[],
  SearchBarState
>(getSearchBar, (searchBar) => searchBar.pinned)

export const getSearchBarPreviousInputValue = createSelector<
  State,
  void,
  string,
  SearchBarState
>(getSearchBar, (searchBar) => searchBar.previous)

export const getSearchBarEditingIndex = createSelector<
  State,
  void,
  number | null,
  SearchBarState
>(getSearchBar, (searchBar) => searchBar.editing)

export const getSearchBarError = createSelector<
  State,
  void,
  string | null,
  SearchBarState
>(getSearchBar, (searchBar) => searchBar.error)

export const getSearchProgram = createSelector<State, void, *, *, *>(
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  (pinned, prev) => {
    const program = [...pinned, prev].map((s) => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)

export default {
  getSearchBar,
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  getSearchBarEditingIndex,
  getSearchBarError,
  getSearchProgram
}
