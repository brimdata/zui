import {State} from "../types"

export default {
  getTimeFormat: (state: State) => state.prefs.timeFormat,
  // TODO: follow this thread
  // getSuricataRunner: (state: State) => state.prefs.suricataRunner,
  // getSuricataUpdater: (state: State) => state.prefs.suricataUpdater,

  // TODO: one migration depends on this...
  // getZeekRunner: (state: State) => state.prefs.zeekRunner,
  getDataDir: (state: State) => state.prefs.dataDir
}
