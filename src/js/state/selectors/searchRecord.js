/* @flow */

import type {SearchRecord} from "../../types"
import type {State} from "../types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getSearchBar} from "./searchBar"
import search from "../search"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    program: getSearchBar(state).previous,
    pins: getSearchBar(state).pinned,
    spanArgs: search.getSpanArgs(state),
    space: getCurrentSpaceName(state)
  }
}
