import {BrowserWindow} from "electron"
import {createOperation} from "../operations"

export const closeWindowOp = createOperation("closeWindow", () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.close()
})
