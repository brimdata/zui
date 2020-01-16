/* @flow */
import {createSelector} from "reselect"

import type {State} from "../types"
import type {TabState} from "./types"
import tabs from "../tabs"

export default function activeTabSelect<T>(fn: (TabState) => T): (State) => T {
  return createSelector<State, void, T, TabState>(tabs.getActiveTab, fn)
}
