import {main} from "./run-main/run-main"
import log from "electron-log"

process.on("unhandledRejection", (e) => {
  log.error(e)
})

main()
