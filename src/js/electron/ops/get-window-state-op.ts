import {createOperation} from "../operations"

export const getWindowStateOp = createOperation(
  "getWindowState",
  ({main}, id: string) => {
    const window = main.windows.find(id)
    if (!window) return undefined
    return window.state
  }
)
