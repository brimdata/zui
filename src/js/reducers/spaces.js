import {createSelector} from "reselect"
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
