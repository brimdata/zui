import log from "electron-log"
import {ZuiMain} from "../zui-main"
import * as initializers from "../initializers"

export async function runInitializers(main: ZuiMain) {
  for (const name in initializers) {
    const mod = initializers[name]
    if ("initialize" in mod) {
      mod.initialize(main)
    } else {
      throw new Error(
        `Expected file "${name}" to export a function named "initialize" but none was found.`
      )
    }
  }
  log.info(`initializers loaded`)
}
