/* @flow */
import {createSelector} from "reselect"

import type {State} from "../types"
import type {TabState} from "./types"
import Tabs from "../Tabs"

export default function activeTabSelect<T>(
  fn: (TabState, State) => T
): (State) => T {
  return createSelector<State, void, T, TabState, State>(
    Tabs.getActiveTab,
    (state) => state,
    fn
  )
}
