require("@electron/remote/main").initialize()
import log from "electron-log"
import {beforeBoot} from "./before-boot"
import {MainArgs, mainDefaults} from "./args"
import {boot} from "./boot"
import {afterBoot} from "./after-boot"

export async function main(args: Partial<MainArgs> = {}) {
  // This must always come first
  const err = await beforeBoot(args)
  if (err) return log.error(err)
  const mainArgs = {...mainDefaults(), ...args}
  log.info("Booting main with:", mainArgs)
  const brim = await boot(mainArgs)
  await afterBoot(brim)
  return brim
}
