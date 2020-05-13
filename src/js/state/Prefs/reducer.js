/* @flow */

import type {PrefsAction, PrefsState} from "./types"

const init: PrefsState = {
  jsonTypeConfig: "",
  timeFormat: "",
  zeekRunner: ""
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
    case "PREFS_TIME_FORMAT_SET":
      return {
        ...state,
        timeFormat: action.format
      }
    case "PREFS_ZEEK_RUNNER_SET":
      return {
        ...state,
        zeekRunner: action.zeekRunner
      }
    default:
      return state
  }
}
