import {PluginContext} from "src/zui"
import {activateBrimcapLoader} from "./loader"
import {activateSuricataUpdater} from "./suricata/update"
import {activateDownloadPacketsCommand} from "./packets/download"
import {activatePacketsMenuItem} from "./packets/menu-item"
import {activateBrimcapConfigurations} from "./configurations"
import {activateSuricataCorrelations} from "./suricata/correlations"
import {activateZeekCorrelations} from "./zeek/correlations"
import {activateStorage} from "./storage"

export function activate(ctx: PluginContext) {
  const {root, suricata} = activateStorage(ctx)

  // suricataupdater and suricatarunner (run by "brimcap analyze")
  // both consult BRIM_SURICATA_USER_DIR.
  process.env.BRIM_SURICATA_USER_DIR = suricata

  activatePacketsMenuItem()
  activateDownloadPacketsCommand(root)
  activateSuricataCorrelations()
  activateZeekCorrelations()
  activateBrimcapLoader(root)
  activateBrimcapConfigurations()
  activateSuricataUpdater()
}
