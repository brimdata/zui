import {createPluginContext} from "src/core/plugin"

// These plugins will maybe live a directory not included in
// the bundle. But for now, bundle them up like all the other
// main process code.

import * as brimcap from "src/plugins/brimcap"
import * as corePool from "src/plugins/core-pool"

export async function runPlugins() {
  corePool.activate(createPluginContext("core-pool"))
  brimcap.activate(createPluginContext("brimcap"))
}
