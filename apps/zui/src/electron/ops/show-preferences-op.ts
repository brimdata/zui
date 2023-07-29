import log from "electron-log"
import {createOperation} from "../../core/operations"

export const showPreferencesOp = createOperation(
  "showPreferencesOp",
  async ({main}) => {
    try {
      const win = main.windows.byName("search")[0]

      if (win) {
        win.ref.focus()
        win.ref.webContents.send("showPreferences")
      } else {
        const newWin = await main.windows.create("search")
        newWin.ref.webContents.once("did-finish-load", () => {
          newWin.ref.webContents.send("showPreferences")
        })
      }
    } catch (e) {
      log.error("preferences failed to open")
    }
  }
)
