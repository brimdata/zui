import {createSelector} from "reselect"
import createReducer from "./createReducer"
import * as Time from "../lib/Time"

const initialState = {}

export default createReducer(initialState, {
  SPACE_INFO_SET: (state, {spaceInfo}) => ({
    ...state,
    ...normalize(spaceInfo)
  })
})

const normalize = space => ({
  [space.name]: {
    ...space,
    minTime: Time.toStore(Time.parseFromSpace(space.min_time)),
    maxTime: Time.toStore(Time.parseFromSpace(space.max_time))
  }
})

const parse = space => ({
  ...space,
  minTime: Time.fromStore(space.minTime),
  maxTime: Time.fromStore(space.maxTime)
})

export const getCurrentSpaceName = state => state.currentSpaceName
export const getRawSpaces = state => state.spaces
export const getSpaces = createSelector(getRawSpaces, rawSpaces =>
  Object.keys(rawSpaces).reduce(
    (spaces, name) => ({
      ...spaces,
      [name]: parse(spaces[name])
    }),
    rawSpaces
  )
)
export const getCurrentSpace = createSelector(
  getSpaces,
  getCurrentSpaceName,
  (spaces, name) => spaces[name]
)
export const getCurrentSpaceTimeWindow = createSelector(
  getCurrentSpace,
  space => (space ? [space.minTime, space.maxTime] : [])
)
