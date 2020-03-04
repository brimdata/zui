/* @flow */
import {ipcMain} from "electron"

import type {$WindowManager, WindowState} from "../../tron/windowManager"
import ipc from ".."
import sendTo from "../sendTo"

export default function(store: *, winMan: $WindowManager) {
  ipcMain.handle("globalStore:init", () => {
    return {
      initialState: store.getState()
    }
  })

  ipcMain.handle("globalStore:dispatch", (e, {action}) => {
    store.dispatch(action)
    for (let win of getWindows(winMan)) {
      sendTo(win.ref.webContents, ipc.globalStore.dispatch(action))
    }
  })
}

function getWindows(winMan): WindowState[] {
  // $FlowFixMe
  return Object.values(winMan.getWindows())
}
