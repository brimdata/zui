import {app} from "electron"
import {ZuiMain} from "../zui-main"
import {MainArgs, mainDefaults} from "./args"
import {runInitializers} from "./run-initializers"
import {runOpListeners} from "./run-op-listeners"
import {runPlugins} from "./run-plugins"

export async function boot(args: Partial<MainArgs> = {}) {
  const main = await ZuiMain.boot({...mainDefaults(), ...args})
  await runInitializers(main)
  await runOpListeners(main)
  await runPlugins(main)
  app.whenReady().then(() => main.start())
  return main
}
