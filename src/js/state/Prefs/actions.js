/* @flow */

import type {
  PREFS_JSON_TYPES_CONFIG_SET,
  PREFS_TIME_FORMAT_SET,
  PREFS_ZEEK_RUNNER_SET
} from "./types"

export default {
  setJSONTypeConfig: (path: string): PREFS_JSON_TYPES_CONFIG_SET => ({
    type: "PREFS_JSON_TYPES_CONFIG_SET",
    path
  }),

  setTimeFormat: (format: string): PREFS_TIME_FORMAT_SET => ({
    type: "PREFS_TIME_FORMAT_SET",
    format
  }),

  setZeekRunner: (zeekRunner: string): PREFS_ZEEK_RUNNER_SET => ({
    type: "PREFS_ZEEK_RUNNER_SET",
    zeekRunner
  })
}
