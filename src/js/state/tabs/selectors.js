/* @flow */
import {createSelector} from "reselect"

import type {State} from "../types"
import type {TabState} from "../tab/types"
import type {TabsState} from "./types"

const getData = (state: State) => state.tabs.data
const getActive = (state: State) => state.tabs.active
const getCount = (state: State) => state.tabs.data.length

const getActiveTab = createSelector<State, void, TabState, TabsState>(
  (state) => state.tabs,
  (tabs) => {
    let tab = tabs.data.find((t) => t.id === tabs.active)
    if (!tab) throw "Can't find active tab"
    return tab
  }
)

export default {
  getData,
  getActive,
  getCount,
  getActiveTab
}
