/* @flow */

import type {SearchRecord} from "../../types"
import type {State} from "../types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchBar} from "./searchBar"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    program: getSearchBar(state).previous,
    pins: getSearchBar(state).pinned,
    span: getOuterTimeWindow(state),
    space: getCurrentSpaceName(state)
  }
}
