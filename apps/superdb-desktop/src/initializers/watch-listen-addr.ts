import {MainObject} from "src/core/main/main-object"
import {configurations} from "src/zui"

export function initialize(main: MainObject) {
  configurations.watch(
    "defaultLake",
    "listenAddr",
    async () => {
      await main.stopLake()
      await main.startLake()
    },
    {skipInitial: true}
  )
}
