/* @flow */
import {createSelector} from "reselect"

import type {SearchState} from "../search/types"
import type {State} from "../types"
import reducer from "./reducer"

export type TabsState = {active: number, data: Tab[]}
export type Tab = SearchState
type TABS_ADD = {type: "TABS_ADD", data?: $Shape<SearchState>}
type TABS_REMOVE = {type: "TABS_REMOVE", id: number}
type TABS_ACTIVATE = {type: "TABS_ACTIVATE", id: number}
export type TabActions = TABS_ADD | TABS_REMOVE | TABS_ACTIVATE

const actions = {
  add: (data?: $Shape<SearchState>): TABS_ADD => ({type: "TABS_ADD", data}),
  remove: (id: number): TABS_REMOVE => ({type: "TABS_REMOVE", id}),
  activate: (id: number): TABS_ACTIVATE => ({type: "TABS_ACTIVATE", id}),
  move: (from: number, to: number) => ({type: "TABS_MOVE", from, to})
}

const selectors = {
  getData: (state: State) => state.tabs.data,
  getActive: (state: State) => state.tabs.active,
  getCount: (state: State) => state.tabs.data.length
}

const getActiveTab = createSelector<State, void, SearchState, TabsState>(
  (state) => state.tabs,
  (tabs) => tabs.data[tabs.active]
)

export default {
  ...actions,
  ...selectors,
  getActiveTab,
  reducer
}
