/* @flow */

import type {BoomdAction, BoomdState} from "./types"

const init: BoomdState = {
  useCache: true,
  useIndex: true
}

export default function reducer(
  state: BoomdState = init,
  action: BoomdAction
): BoomdState {
  switch (action.type) {
    case "BOOMD_USE_CACHE":
      return {
        ...state,
        useCache: action.value
      }
    case "BOOMD_USE_INDEX":
      return {
        ...state,
        useIndex: action.value
      }
    default:
      return state
  }
}
