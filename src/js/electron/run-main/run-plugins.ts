import {createPluginContext} from "src/core/plugin"

// These plugins will maybe live a directory not included in
// the bundle. But for now, bundle them up like all the other
// main process code.

import * as brimcap from "src/plugins/brimcap"
import * as suricata from "src/plugins/suricata"
import * as zeek from "src/plugins/zeek"

export async function runPlugins() {
  brimcap.activate(createPluginContext("brimcap"))
  suricata.activate(createPluginContext("suricata"))
  zeek.activate(createPluginContext("zeek"))
}
