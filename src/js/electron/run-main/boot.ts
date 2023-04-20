import {app} from "electron"
import {ZuiMain} from "../zui-main"
import {MainArgs, mainDefaults} from "./args"
import {runInitializers} from "./run-initializers"
import {runOpListeners} from "./run-op-listeners"
import {runPlugins} from "./run-plugins"

export async function boot(args: Partial<MainArgs> = {}) {
  const main = await ZuiMain.boot({...mainDefaults(), ...args})
  await runOpListeners(main) // 1. This goes first in case initializers run ops
  await runInitializers(main) // 2.
  await runPlugins(main) // 3.
  app.whenReady().then(() => main.start())
  return main
}
