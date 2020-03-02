/* @flow */
import {ipcMain} from "electron"

import ipc from ".."
import sendTo from "../sendTo"

export default function(store: *) {
  let windows = new Map()
  // XXX We need to clean up these windows when they close

  ipcMain.handle("globalStore:init", (e) => {
    windows.set(e.sender.id, e.sender)
    return {
      id: e.sender.id,
      initialState: store.getState()
    }
  })

  ipcMain.handle("globalStore:dispatch", (e, {action}) => {
    store.dispatch(action)
    for (let [_id, web] of windows) {
      sendTo(web, ipc.globalStore.dispatch(action))
    }
  })
}
