require("@electron/remote/main").initialize()
import log from "electron-log"
import {beforeBoot} from "./main-run/before-boot"
import {MainArgs} from "./main-run/args"
import {boot} from "./main-run/boot"
import {afterBoot} from "./main-run/after-boot"

export async function main(args: Partial<MainArgs> = {}) {
  const err = await beforeBoot()
  if (err) return log.error(err)

  const brim = await boot(args)

  await afterBoot(brim)

  return brim
}

process.on("unhandledRejection", (e) => {
  log.error(e)
})

main()
