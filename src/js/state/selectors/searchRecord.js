/* @flow */

import type {SearchRecord} from "../../types"
import type {State} from "../types"
import {getSearchBar} from "./searchBar"
import Tab from "../Tab"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    program: getSearchBar(state).previous,
    pins: getSearchBar(state).pinned,
    spanArgs: Tab.getSpanArgs(state),
    space: Tab.spaceName(state)
  }
}
