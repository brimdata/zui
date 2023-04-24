import log from "electron-log"
import {createOperation} from "../../../core/operations"

export const openSearchWindowOp = createOperation(
  "openSearchWindow",
  async ({main}) => {
    try {
      if (main.windows.singleHidden) {
        main.windows.unhideAll()
      } else {
        await main.windows.create("search")
      }
    } catch (e) {
      log.error("search window failed to open")
    }
  }
)
