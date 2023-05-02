import {app} from "electron"
import {ZuiMain} from "../zui-main"
import {MainArgs, mainDefaults} from "./args"
import {runInitializers} from "./run-initializers"
import {runOperations} from "./run-operations"
import {runPlugins} from "./run-plugins"
import {runPluginBindings} from "./run-plugin-bindings"
import {runProtocolHandlers} from "./run-protocol-handlers"

export async function boot(args: Partial<MainArgs> = {}) {
  const main = await ZuiMain.boot({...mainDefaults(), ...args})
  // 1. Provide the plugin apis with the things they need from main
  runPluginBindings(main)
  // 2. Call listen on all operations
  await runOperations(main)
  // 3. Run all the initialize functions in the intializers folder
  await runInitializers(main)
  // 4. Activate all plugins in the plugins folder
  await runPlugins()
  // 5. Protocol Handler
  await runProtocolHandlers()
  // 6. Start the app
  app.whenReady().then(() => main.start())
  return main
}
