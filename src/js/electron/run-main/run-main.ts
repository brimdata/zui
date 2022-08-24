require("@electron/remote/main").initialize()
import log from "electron-log"
import {beforeBoot} from "./before-boot"
import {MainArgs, mainDefaults} from "./args"
import {boot} from "./boot"
import {afterBoot} from "./after-boot"

export async function main(args: Partial<MainArgs> = {}) {
  const mainArgs = {...mainDefaults(), ...args}

  const err = await beforeBoot(mainArgs)
  if (err) return log.error(err)

  const brim = await boot(mainArgs)

  await afterBoot(brim)

  return brim
}
