import {zjson} from "@brimdata/zed-js"
import {createOperation} from "../../../core/operations"
import log from "electron-log"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async ({main}, opts: {value: zjson.Obj; url: string}) => {
    try {
      const win = await main.windows.create("detail")
      await win.whenInitialized()
      win.send("detail-window-args", opts)
    } catch (e) {
      log.error("detail window failed to open")
    }
  }
)
