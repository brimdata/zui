/* @flow */

import type {SpacesAction, SpacesState} from "./types"

const init: SpacesState = {}

function spacesReducer(state, action) {
  switch (action.type) {
    case "SPACES_NAMES":
      return {
        ...state,
        ...replaceNames(action, state)
      }
    case "SPACES_DETAIL":
      return {
        ...state,
        [action.space.name]: {
          ...action.space
        }
      }
    case "SPACES_PACKET_POST_STATUS":
      return {
        ...state,
        [action.space]: {
          ...state[action.space],
          packet_post_status: action.status
        }
      }
    default:
      return state
  }
}

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  return {
    ...state,
    [action.clusterId]: spacesReducer(state[action.clusterId] || {}, action)
  }
}

function replaceNames({names}, spaces) {
  let prev = spaces || {}
  let next = {}
  names.forEach((name) => (next[name] = prev[name]))
  return next
}
