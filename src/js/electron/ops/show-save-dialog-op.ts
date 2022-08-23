import {BrowserWindow, dialog, SaveDialogOptions} from "electron"
import {createOperation} from "../operations"

export const showSaveDialogOp = createOperation(
  "showSaveDialogOp",
  (main, e, args: SaveDialogOptions) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return dialog.showSaveDialog(win, args)
  }
)
