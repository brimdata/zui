import {ipcMain} from "electron"
import {BrimMain} from "../brim"

export function handle(_main: BrimMain) {
  ipcMain.handle("openDetailWindow", (_e, _args) => {
    // FUTURE WORK: Working on a new way to open the log details window
  })
}
