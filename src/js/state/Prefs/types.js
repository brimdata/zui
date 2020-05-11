/* @flow */

export type PrefsState = {
  jsonTypeConfig: string,
  timeFormat: string
}

export type PrefsAction = PREFS_JSON_TYPES_CONFIG_SET | PREFS_TIME_FORMAT_SET

export type PREFS_JSON_TYPES_CONFIG_SET = {
  type: "PREFS_JSON_TYPES_CONFIG_SET",
  path: string
}

export type PREFS_TIME_FORMAT_SET = {
  type: "PREFS_TIME_FORMAT_SET",
  format: string
}
