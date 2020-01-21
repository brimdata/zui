/* @flow */

import type {SearchRecord} from "../../types"
import type {State} from "../types"
import SearchBar from "../SearchBar"
import Tab from "../Tab"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    program: SearchBar.getSearchBar(state).previous,
    pins: SearchBar.getSearchBar(state).pinned,
    spanArgs: Tab.getSpanArgs(state),
    space: Tab.spaceName(state)
  }
}
