/* @flow */
import {createSelector} from "reselect"

import type {SearchActions, SearchState} from "../search/types"
import type {State} from "../types"
import search from "../search"

export type TabsState = {active: "0", data: TabDataState}
export type Tab = SearchState
type TabDataState = {[string]: SearchState}
type TABS_ADD = {type: "TABS_ADD", data?: $Shape<SearchState>}
type TABS_REMOVE = {type: "TABS_REMOVE", id: string}
type TABS_ACTIVATE = {type: "TABS_ACTIVATE", id: string}
export type TabActions = TABS_ADD | TABS_REMOVE | TABS_ACTIVATE

const actions = {
  add: (data?: $Shape<SearchState>): TABS_ADD => ({type: "TABS_ADD", data}),
  remove: (id: string): TABS_REMOVE => ({type: "TABS_REMOVE", id}),
  activate: (id: string): TABS_ACTIVATE => ({type: "TABS_ACTIVATE", id})
}

const selectors = {
  getData: (state: State) => state.tabs.data,
  getActive: (state: State) => state.tabs.active
}

const getAll = createSelector<State, void, SearchState[], TabDataState>(
  selectors.getData,
  (data) =>
    Object.keys(data)
      .map((id) => parseInt(id))
      .sort()
      .map((id) => data[id.toString()])
)

const getActiveTab = createSelector<State, void, SearchState, TabsState>(
  (state) => state.tabs,
  (tabs) => tabs.data[tabs.active]
)

function initTab() {
  return {
    span: [{sec: 0, ns: 0}, {sec: 1, ns: 0}],
    spanArgs: ["now - 5m", "now"],
    spanFocus: null
  }
}
const init = {active: "0", data: {"0": initTab()}}

function reducer(state: TabsState = init, action: TabActions | SearchActions) {
  if (action.type.startsWith("SEARCH_")) {
    let {data, active} = state
    let tab = data[active]
    return {
      active,
      data: {
        ...data,
        [active]: {
          ...tab,
          ...search.reducer(tab, action)
        }
      }
    }
  }

  switch (action.type) {
    case "TABS_ACTIVATE":
      return {...state, active: action.id}
    case "TABS_REMOVE":
    case "TABS_ADD":
      return {...state, data: dataReducer(state.data, action)}
    default:
      return state
  }
}

function dataReducer(state: TabDataState, action: TabActions): TabDataState {
  switch (action.type) {
    case "TABS_ADD":
      return {...state, [initId(state)]: {...initTab(), ...action.data}}
    case "TABS_REMOVE":
      var newState = {...state}
      delete newState[action.id]
      return newState
    default:
      return state
  }
}

function initId(state): string {
  return Object.keys(state).length.toString()
}

export default {
  ...actions,
  ...selectors,
  getActiveTab,
  getAll,
  reducer
}
