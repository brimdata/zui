import log from "electron-log"
import {createOperation} from "../../core/operations"

export const showReleaseNotesOp = createOperation(
  "showReleaseNotes",
  async ({main}) => {
    try {
      const win = main.windows.byName("search")[0]
      if (win) {
        win.ref.webContents.send("showReleaseNotes")
      } else {
        const newWin = await main.windows.create("search")
        newWin.ref.webContents.once("did-finish-load", () => {
          newWin.ref.webContents.send("showReleaseNotes")
        })
      }
    } catch (e) {
      log.error("release notes failed to open")
    }
  }
)
