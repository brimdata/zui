/* @flow */
import type {SearchRecord} from "../types"
import type {State} from "../reducers/types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchBar} from "./searchBar"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    searchBar: getSearchBar(state),
    span: getOuterTimeWindow(state),
    space: getCurrentSpaceName(state)
  }
}
