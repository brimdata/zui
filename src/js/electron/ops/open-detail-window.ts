import {zjson} from "@brimdata/zealot"
import {createOperation, createSpecialOperation} from "../main-op"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async (main, e, arg: {value: zjson.Object; url: string}) => {
    const {url, value} = arg
    const win = await main.windows.openWindow("detail", {size: [600, 700]})
    setupDetailWindow.return({value, url}).when((id) => id === win.id)
  }
)

export const setupDetailWindow = createSpecialOperation<
  string,
  {value: zjson.Object; url: string}
>("detailWindow.setup")
