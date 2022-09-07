import {createOperation} from "../operations"

export const showReleaseNotesOp = createOperation(
  "showReleaseNotes",
  async ({main}) => {
    const win = main.windows.byName("search")[0]

    if (win) {
      win.ref.webContents.send("showReleaseNotes")
    } else {
      const newWin = await main.windows.create("search")
      newWin.ref.webContents.once("did-finish-load", () => {
        newWin.ref.webContents.send("showReleaseNotes")
      })
    }
  }
)
