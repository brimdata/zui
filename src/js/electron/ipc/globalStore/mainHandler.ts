import {ipcMain} from "electron"
import ipc from ".."
import sendTo from "../sendTo"
import {Brim} from "../../brim"

export default function(brim: Brim) {
  ipcMain.handle("globalStore:init", () => {
    return {
      initialState: brim.store.getState()
    }
  })

  ipcMain.handle("globalStore:dispatch", (e, {action}) => {
    brim.store.dispatch(action)
    for (const win of brim.windows.getWindows()) {
      if (!win.ref.isDestroyed()) {
        sendTo(win.ref.webContents, ipc.globalStore.dispatch(action))
      }
    }
  })
}
