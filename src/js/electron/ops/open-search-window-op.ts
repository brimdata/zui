import log from "electron-log"
import {createOperation} from "../operations"

export const openSearchWindowOp = createOperation(
  "openSearchWindow",
  async ({main}) => {
    try {
      await main.windows.create("search")
    } catch (e) {
      log.error("search window failed to open")
    }
  }
)
