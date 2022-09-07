import {BrowserWindow, dialog} from "electron"
import {createOperation} from "../operations"

export const openDirectoryOp = createOperation(
  "openDirectory",
  async ({event}) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    })
    return result
  }
)
