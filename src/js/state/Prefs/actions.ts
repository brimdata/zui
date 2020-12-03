import {
  PREFS_DATA_DIR_SET,
  PREFS_JSON_TYPES_CONFIG_SET,
  PREFS_TIME_FORMAT_SET,
  PREFS_SURICATA_RUNNER_SET,
  PREFS_SURICATA_UPDATER_SET,
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

  setSuricataRunner: (suricataRunner: string): PREFS_SURICATA_RUNNER_SET => ({
    type: "PREFS_SURICATA_RUNNER_SET",
    suricataRunner
  }),

  setSuricataUpdater: (
    suricataUpdater: string
  ): PREFS_SURICATA_UPDATER_SET => ({
    type: "PREFS_SURICATA_UPDATER_SET",
    suricataUpdater
  }),

  setZeekRunner: (zeekRunner: string): PREFS_ZEEK_RUNNER_SET => ({
    type: "PREFS_ZEEK_RUNNER_SET",
    zeekRunner
  }),

  setDataDir: (dataDir: string): PREFS_DATA_DIR_SET => ({
    type: "PREFS_DATA_DIR_SET",
    dataDir
  })
}
