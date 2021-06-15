import {PREFS_DATA_DIR_SET, PREFS_TIME_FORMAT_SET} from "./types"

export default {
  setTimeFormat: (format: string): PREFS_TIME_FORMAT_SET => ({
    type: "$PREFS_TIME_FORMAT_SET",
    format
  }),
  setDataDir: (dataDir: string): PREFS_DATA_DIR_SET => ({
    type: "$PREFS_DATA_DIR_SET",
    dataDir
  })
}
