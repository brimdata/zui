import {createOperation} from "../../../core/operations"

export const getWindowStateOp = createOperation(
  "getWindowState",
  ({main}, id: string) => {
    const window = main.windows.find(id)
    if (!window) return undefined
    return window.state
  }
)
