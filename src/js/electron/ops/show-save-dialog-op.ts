import {BrowserWindow, dialog, SaveDialogOptions} from "electron"
import {createOperation} from "../operations"

export const showSaveDialogOp = createOperation(
  "showSaveDialogOp",
  ({event}, opts: SaveDialogOptions) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return dialog.showSaveDialog(win, opts)
  }
)
