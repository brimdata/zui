import {zjson} from "@brimdata/zealot"
import {createOperation, createSpecialOperation} from "../operations"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async (main, e, arg: {value: zjson.Object; url: string}) => {
    const {url, value} = arg
    const win = await main.windows.create("detail")
    setupDetailWindow.return({value, url}).when((id) => id === win.id)
  }
)

export const setupDetailWindow = createSpecialOperation<
  string,
  {value: zjson.Object; url: string}
>("detailWindow.setup")
