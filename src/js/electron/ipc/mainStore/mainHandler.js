/* @flow */
import {ipcMain} from "electron"

import createMainStore from "../../../state/createMainStore"
import ipc from ".."
import sendTo from "../sendTo"

export default function() {
  let windows = new Map()
  let store = createMainStore()

  ipcMain.handle("mainStore:init", (e) => {
    windows.set(e.sender.id, e.sender)
    return {
      id: e.sender.id,
      initialState: store.getState()
    }
  })

  ipcMain.handle("mainStore:dispatch", (e, {action}) => {
    store.dispatch(action)
    for (let [_id, web] of windows) {
      sendTo(web, ipc.mainStore.dispatch(action))
    }
  })
}
