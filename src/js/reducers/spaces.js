import {createSelector} from "reselect"
import {toDate} from "../cast"
import createReducer from "./createReducer"

const initialState = {}

export default createReducer(initialState, {
  SPACE_INFO_SET: (state, {spaceInfo}) => {
    return {
      ...state,
      [spaceInfo.name]: spaceInfo
    }
  }
})

export const getCurrentSpaceName = state => state.currentSpaceName
export const getSpaces = state => state.spaces
export const getCurrentSpace = createSelector(
  getSpaces,
  getCurrentSpaceName,
  (spaces, name) => spaces[name]
)
export const getCurrentSpaceTimeWindow = createSelector(
  getCurrentSpace,
  space => {
    if (!space) return []
    const to = toDate(space.max_time.sec + "." + space.max_time.ns)
    const from = toDate(space.min_time.sec + "." + space.min_time.ns)
    return [from, to]
  }
)
