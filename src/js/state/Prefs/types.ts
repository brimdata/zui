export type PrefsState = {
  timeFormat: string
  dataDir: string
}

export type PrefsAction = PREFS_TIME_FORMAT_SET | PREFS_DATA_DIR_SET

export type PREFS_TIME_FORMAT_SET = {
  type: "$PREFS_TIME_FORMAT_SET"
  format: string
}

export type PREFS_DATA_DIR_SET = {
  type: "$PREFS_DATA_DIR_SET"
  dataDir: string
}
