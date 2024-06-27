import {PluginContext} from "src/zui"
import {join} from "path"
import {ensureDirSync} from "fs-extra"

export function setupPacketsRoot(ctx: PluginContext) {
  const root = join(ctx.storagePath, "root")
  ensureDirSync(root)
  return root
}

export function setupSuricataRoot(ctx: PluginContext) {
  const root = join(ctx.storagePath, "suricata")
  ensureDirSync(root)
  // suricataupdater and suricatarunner (run by "brimcap analyze")
  // both consult BRIM_SURICATA_USER_DIR.
  process.env.BRIM_SURICATA_USER_DIR = root
  return root
}

export function activateStorage(ctx: PluginContext) {
  return {
    suricata: setupSuricataRoot(ctx),
    root: setupPacketsRoot(ctx),
  }
}
