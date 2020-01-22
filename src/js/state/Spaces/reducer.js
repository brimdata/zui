/* @flow */

import type {SpacesAction, SpacesState} from "./types"

const init: SpacesState = {}

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  switch (action.type) {
    case "SPACES_NAMES":
      return {
        ...state,
        [action.clusterId]: replaceNames(action, state[action.clusterId])
      }
    case "SPACES_DETAIL":
      return {
        ...state,
        [action.clusterId]: {
          ...state[action.clusterId],
          [action.space.name]: action.space
        }
      }
    default:
      return state
  }
}

function replaceNames({names}, spaces) {
  let prev = spaces || {}
  let next = {}
  names.forEach((name) => (next[name] = prev[name]))
  return next
}
