import log from "electron-log"
import {beforeBoot} from "./before-boot"
import {MainArgs, mainDefaults} from "./args"
import {boot} from "./boot"
import {afterBoot} from "./after-boot"
import {nanoid} from "@reduxjs/toolkit"

export async function main(args: Partial<MainArgs> = {}) {
  /* 
    BEFORE BOOT: Can affect the default main args
  */
  const err = await beforeBoot(args)
  if (err) return log.error(err)

  /*
    BOOT: Starts the app
  */
  const mainArgs = {...mainDefaults(), ...args}
  log.info("booting main with:", mainArgs)
  const zuiMain = await boot(mainArgs)

  /* 
    AFTER BOOT: Non-critical setup items
  */
  await afterBoot(zuiMain)
  zuiMain.store.id = nanoid()
  return zuiMain
}
