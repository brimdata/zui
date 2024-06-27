import {createOperation} from "../../core/operations"

export const windowInitialized = createOperation(
  "windowInitialized",
  ({main}, id: string) => {
    const win = main.windows.find(id)
    if (win) win.didInitialize()
  }
)
