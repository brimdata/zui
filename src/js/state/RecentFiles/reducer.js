/* @flow */

import type {RecentFilesAction, RecentFilesState} from "./types"

const init: RecentFilesState = {}

export default function reducer(
  state: RecentFilesState = init,
  action: RecentFilesAction
): RecentFilesState {
  switch (action.type) {
    case "RECENT_FILES_OPEN":
      return {
        ...state,
        [action.file]: action.lastOpened
      }
    case "RECENT_FILES_REMOVE":
      var newState = {...state}
      delete newState[action.file]
      return newState
    default:
      return state
  }
}
