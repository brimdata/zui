

import { PrefsAction, PrefsState } from "./types";

const init: PrefsState = {
  jsonTypeConfig: "",
  timeFormat: "",
  zeekRunner: "",
  dataDir: ""
};

export default function reducer(state: PrefsState = init, action: PrefsAction): PrefsState {
  switch (action.type) {
    case "PREFS_JSON_TYPES_CONFIG_SET":
      return {
        ...state,
        jsonTypeConfig: action.path
      };
    case "PREFS_TIME_FORMAT_SET":
      return {
        ...state,
        timeFormat: action.format
      };
    case "PREFS_ZEEK_RUNNER_SET":
      return {
        ...state,
        zeekRunner: action.zeekRunner
      };
    case "PREFS_DATA_DIR_SET":
      return {
        ...state,
        dataDir: action.dataDir
      };
    default:
      return state;

  }
}