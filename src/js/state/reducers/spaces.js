/* @flow */

import {createSelector} from "reselect"

import type {State} from "./types"
import {fromStore, parseFromBoom, toStore} from "../../lib/Time"
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
      ...normalize(spaceInfo)
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

const normalize = (space) => ({
  [space.name]: {
    ...space,
    minTime: toStore(parseFromBoom(space.min_time)),
    maxTime: toStore(parseFromBoom(space.max_time))
  }
})

const parse = (space) => ({
  ...space,
  minTime: fromStore(space.minTime),
  maxTime: fromStore(space.maxTime)
})

export const getAllSpaceNames = (state: State): string[] => {
  return state.spaces.names
}

export const getCurrentSpaceName = (state: State) => {
  return state.spaces.current
}

export const getRawSpaces = (state: State) => {
  return state.spaces.details
}
export const getSpaces = createSelector<State, void, *, *>(
  getRawSpaces,
  (rawSpaces) => {
    return Object.keys(rawSpaces).reduce(
      (spaces, name) => ({
        ...spaces,
        [name]: parse(spaces[name])
      }),
      rawSpaces
    )
  }
)

export const getCurrentSpace = createSelector<State, void, *, *, *>(
  getSpaces,
  getCurrentSpaceName,
  (spaces, name) => spaces[name]
)

export const getCurrentSpaceTimeWindow = createSelector<State, void, *, *>(
  getCurrentSpace,
  (space) => [space.minTime, space.maxTime]
)
