/* @flow */

import type {SpacesAction, SpacesState} from "./types"
import produce from "immer"

const init: SpacesState = {}

const spacesReducer = produce((draft, action: SpacesAction) => {
  switch (action.type) {
    case "SPACES_NAMES":
      return action.names.reduce((next, name) => {
        next[name] = draft[name]
        return next
      }, {})

    case "SPACES_DETAIL":
      var {name} = action.space
      draft[name] = {...draft[name], ...action.space}
      break

    case "SPACES_INGEST_PROGRESS":
      getSpace(draft, action.space).ingest_progress = action.value
      break

    case "SPACES_INGEST_WARNING_APPEND":
      getSpace(draft, action.space).ingest_warnings.push(action.warning)
      break

    case "SPACES_INGEST_WARNING_CLEAR":
      draft[action.space].ingest_warnings = []
      break
  }
})

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  if (action.type.startsWith("SPACES_")) {
    return {
      ...state,
      [action.clusterId]: spacesReducer(state[action.clusterId] || {}, action)
    }
  } else {
    return state
  }
}

function getSpace(state, name) {
  let space = state[name] ? state[name] : {}
  if (!space.ingest_warnings) space.ingest_warnings = []
  if (!space.ingest_progress) space.ingest_progress = null
  state[name] = space
  return state[name]
}
