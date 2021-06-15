import {State} from "../types"

export default {
  getTimeFormat: (state: State) => state.prefs.timeFormat,
  getDataDir: (state: State) => state.prefs.dataDir
}
