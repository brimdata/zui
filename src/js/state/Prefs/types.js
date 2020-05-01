/* @flow */

export type PrefsState = {
  jsonTypeConfig: string
}

export type PrefsAction = PREFS_JSON_TYPES_CONFIG_SET

export type PREFS_JSON_TYPES_CONFIG_SET = {
  type: "PREFS_JSON_TYPES_CONFIG_SET",
  path: string
}
