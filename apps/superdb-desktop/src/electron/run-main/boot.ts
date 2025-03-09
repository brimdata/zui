import {app} from "electron"

import {MainArgs, mainDefaults} from "./args"
import {runInitializers} from "./run-initializers"
import {runOperations} from "./run-operations"
import {runPlugins} from "./run-plugins"
import {runMainBindings} from "./run-main-bindings"
import {runProtocolHandlers} from "./run-protocol-handlers"
import {MainObject} from "src/core/main/main-object"
import {runConfigurations} from "./run-configurations"

export async function boot(args: Partial<MainArgs> = {}) {
  const main = await MainObject.boot({...mainDefaults(), ...args})
  // 1. Provide the plugin apis with the things they need from main
  runMainBindings(main)
  // 2. Call listen on all operations (needed for global dispatch)
  runOperations(main)
  // 3. Set the default values for core configurations
  runConfigurations()
  // 4. Run all the initialize functions in the initializers folder
  await runInitializers(main)
  // 5. Activate all plugins in the plugins folder
  await runPlugins()
  // 6. Protocol Handler
  runProtocolHandlers()
  // 7. Start the app
  await app.whenReady()
  await main.start()
  return main
}
