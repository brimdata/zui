import {app} from "electron"
import {BrimMain} from "../brim"
import {MainArgs, mainDefaults} from "./args"
import {runInitializers} from "./run-initializers"

export async function boot(args: Partial<MainArgs> = {}) {
  const brim = await BrimMain.boot({...mainDefaults(), ...args})
  await runInitializers(brim)
  app.whenReady().then(() => brim.start())
  return brim
}
