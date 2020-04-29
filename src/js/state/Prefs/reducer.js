/* @flow */

import type {PrefsAction, PrefsState} from "./types"

const init: PrefsState = {
  jsonTypeConfig: "default"
}

export default function reducer(
  state: PrefsState = init,
  action: PrefsAction
): PrefsState {
  switch (action.type) {
    case "PREFS_JSON_TYPES_CONFIG_SET":
      return {
        ...state,
        jsonTypeConfig: action.path
      }
    default:
      return state
  }
}
