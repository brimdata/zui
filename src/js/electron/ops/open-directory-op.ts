import {BrowserWindow, dialog} from "electron"
import {createOperation} from "../operations"

export const openDirectoryOp = createOperation(
  "openDirectory",
  async (main, e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    })
    return result
  }
)
