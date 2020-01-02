/* @flow */

import {createSelector} from "reselect"

import type {State} from "../types"
import tab from "../tab"

export const getCurrentSpaceName = tab.select<string>((tab) => tab.search.space)

export const getSpaces = (state: State) => {
  return state.spaces.details
}

export const getCurrentSpace = createSelector<State, void, *, *, *>(
  getSpaces,
  getCurrentSpaceName,
  (spaces, name) => spaces[name]
)

export const getCurrentSpaceTimeWindow = createSelector<State, void, *, *>(
  getCurrentSpace,
  (space) => {
    return [
      {sec: space.min_time.sec, ns: 0},
      {sec: space.max_time.sec + 1, ns: 0}
    ]
  }
)
