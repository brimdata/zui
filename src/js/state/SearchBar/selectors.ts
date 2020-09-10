import {createSelector} from "reselect"

import {SearchBarState, SearchTarget} from "./types"
import {State} from "../types"
import {TabState} from "../Tab/types"
import Tabs from "../Tabs"
import brim from "../../brim"

export const getSearchBar = createSelector<State, TabState, SearchBarState>(
  Tabs.getActiveTab,
  (tab) => tab.searchBar
)

export const getSearchBarInputValue = createSelector<
  State,
  SearchBarState,
  string
>(getSearchBar, (searchBar) => searchBar.current)

export const getSearchBarPins = createSelector<State, SearchBarState, string[]>(
  getSearchBar,
  (searchBar) => searchBar.pinned
)

export const getSearchBarPreviousInputValue = createSelector<
  State,
  SearchBarState,
  string
>(getSearchBar, (searchBar) => searchBar.previous)

export const getSearchBarEditingIndex = createSelector<
  State,
  SearchBarState,
  number | null
>(getSearchBar, (searchBar) => searchBar.editing)

export const getSearchBarError = createSelector<
  State,
  SearchBarState,
  string | null
>(getSearchBar, (searchBar) => searchBar.error)

export const getSearchProgram = createSelector<State, string[], string, string>(
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  (pinned, prev) => brim.program(prev, pinned).string() || "*"
)

export const getTarget = createSelector<State, SearchBarState, SearchTarget>(
  getSearchBar,
  (state) => state.target
)
