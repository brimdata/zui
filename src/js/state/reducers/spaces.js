/* @flow */

import {createSelector} from "reselect"

import type {State} from "../types"
import createReducer from "./createReducer"

const initialState = {
  details: {},
  names: [],
  current: null
}

type Space = Object
export type Spaces = {
  details: {[string]: Space},
  names: string[],
  current: string
}

export default createReducer(initialState, {
  SPACES_CLEAR: () => ({
    ...initialState
  }),
  ALL_SPACES_REQUEST: () => ({
    ...initialState
  }),
  SPACE_INFO_SET: (state, {spaceInfo}) => ({
    ...state,
    details: {
      ...state.details,
      [spaceInfo.name]: spaceInfo
    }
  }),
  SPACE_NAMES_SET: (state, {names}) => ({
    ...state,
    names
  }),
  CURRENT_SPACE_NAME_SET: (state, {name}) => ({
    ...state,
    current: name
  })
})

export const getAllSpaceNames = (state: State): string[] => {
  return state.spaces.names
}

export const getCurrentSpaceName = (state: State) => {
  return state.spaces.current
}

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
