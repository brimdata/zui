import {createSelector} from "reselect"

import {SearchBarState} from "./types"
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

export const getSearchBarError = createSelector<
  State,
  SearchBarState,
  string | null
>(getSearchBar, (searchBar) => searchBar.error)

export const getSearchProgram = createSelector<State, string[], string, string>(
  getSearchBarPins,
  getSearchBarInputValue,
  (pinned, program) => brim.program(program, pinned).string() || "*"
)
