/* @flow */
import type {SearchRecord} from "../types"
import type {State} from "../state/reducers/types"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getOuterTimeWindow} from "../state/reducers/timeWindow"
import {getSearchBar} from "./searchBar"

export const getSearchRecord = (state: State): SearchRecord => {
  return {
    program: getSearchBar(state).current,
    pins: getSearchBar(state).pinned,
    span: getOuterTimeWindow(state),
    space: getCurrentSpaceName(state)
  }
}
