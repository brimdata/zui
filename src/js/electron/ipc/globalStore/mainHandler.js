/* @flow */
import {ipcMain} from "electron"

import createGlobalStore from "../../../state/createGlobalStore"
import ipc from ".."
import sendTo from "../sendTo"

export default function() {
  let windows = new Map()
  let store = createGlobalStore()

  ipcMain.handle("globalStore:init", (e) => {
    windows.set(e.sender.id, e.sender)
    return {
      id: e.sender.id,
      initialState: store.getState()
    }
  })

  ipcMain.handle("globalStore:dispatch", (e, {action}) => {
    console.log("DISPATCH", action)
    store.dispatch(action)
    for (let [_id, web] of windows) {
      sendTo(web, ipc.globalStore.dispatch(action))
    }
  })
}
