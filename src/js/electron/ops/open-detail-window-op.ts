import {zjson} from "@brimdata/zealot"
import {createOperation, createSpecialOperation} from "../operations"

export const openDetailWindow = createOperation(
  "detailWindow.open",
  async ({main}, opts: {value: zjson.Object; url: string}) => {
    const win = await main.windows.create("detail")
    // or just wait until it's loaded, then send it something
    setupDetailWindow.return(opts).when((id) => id === win.id)
  }
)

export const setupDetailWindow = createSpecialOperation<
  string,
  {value: zjson.Object; url: string}
>("detailWindow.setup")
