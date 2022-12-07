import {zjson} from "@brimdata/zealot"
import {createOperation} from "../operations"
import log from "electron-log"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async ({main}, opts: {value: zjson.Object; url: string}) => {
    try {
      const win = await main.windows.create("detail")
      await win.whenInitialized()
      win.send("detail-window-args", opts)
    } catch (e) {
      log.error("detail window failed to open")
    }
  }
)
