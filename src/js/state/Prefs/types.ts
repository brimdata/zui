export type PrefsState = {
  jsonTypeConfig: string
  timeFormat: string
  suricataRunner: string
  suricataUpdater: string
  zeekRunner: string
  dataDir: string
}

export type PrefsAction =
  | PREFS_JSON_TYPES_CONFIG_SET
  | PREFS_TIME_FORMAT_SET
  | PREFS_SURICATA_RUNNER_SET
  | PREFS_SURICATA_UPDATER_SET
  | PREFS_ZEEK_RUNNER_SET
  | PREFS_DATA_DIR_SET

export type PREFS_JSON_TYPES_CONFIG_SET = {
  type: "PREFS_JSON_TYPES_CONFIG_SET"
  path: string
}

export type PREFS_TIME_FORMAT_SET = {
  type: "PREFS_TIME_FORMAT_SET"
  format: string
}

export type PREFS_SURICATA_RUNNER_SET = {
  type: "PREFS_SURICATA_RUNNER_SET"
  suricataRunner: string
}

export type PREFS_SURICATA_UPDATER_SET = {
  type: "PREFS_SURICATA_UPDATER_SET"
  suricataUpdater: string
}

export type PREFS_ZEEK_RUNNER_SET = {
  type: "PREFS_ZEEK_RUNNER_SET"
  zeekRunner: string
}

export type PREFS_DATA_DIR_SET = {
  type: "PREFS_DATA_DIR_SET"
  dataDir: string
}
