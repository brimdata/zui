import {createOperation} from "../operations"

export const openSearchWindowOp = createOperation(
  "openSearchWindow",
  async ({main}) => {
    return main.windows.create("search")
  }
)
