import {zjson} from "@brimdata/zealot"
import {createOperation} from "../operations"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async ({main}, opts: {value: zjson.Object; url: string}) => {
    const win = await main.windows.create("detail")
    await win.whenInitialized()
    win.send("detail-window-args", opts)
  }
)
