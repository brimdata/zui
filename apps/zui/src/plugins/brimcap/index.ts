import {PluginContext} from "src/zui"
import {activateSuricataCorrelations} from "./suricata/correlations"
import {activateZeekCorrelations} from "./zeek/correlations"

export function activate(_ctx: PluginContext) {
  activateSuricataCorrelations()
  activateZeekCorrelations()
}
