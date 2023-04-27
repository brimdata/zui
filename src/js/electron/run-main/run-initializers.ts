import log from "electron-log"
import {ZuiMain} from "../zui-main"
import * as initializers from "../initializers"

export async function runInitializers(main: ZuiMain) {
  for (const name in initializers) {
    const mod = initializers[name]
    if ("initialize" in mod) {
      mod.initialize(main)
    }
  }
  log.info(`initializers loaded`)
}
