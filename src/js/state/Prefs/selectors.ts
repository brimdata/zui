import {State} from "../types"

export default {
  getJSONTypeConfig: (state: State) => state.prefs.jsonTypeConfig,
  getTimeFormat: (state: State) => state.prefs.timeFormat,
  getZeekRunner: (state: State) => state.prefs.zeekRunner,
  getDataDir: (state: State) => state.prefs.dataDir
}
