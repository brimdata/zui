import debug from "why-is-node-running"
import {main} from "./run-main/run-main"
import log from "electron-log"

process.on("unhandledRejection", (e) => {
  log.error(e)
})

main()

setTimeout(() => {
  debug() // logs out active handles that are keeping node running
}, 15_000)
