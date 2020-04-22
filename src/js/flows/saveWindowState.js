/* @flow */
import {ipcRenderer} from "electron"

import type {Thunk} from "../state/types"
import rpc from "../electron/rpc"

export default (): Thunk => (_, getState) => {
  rpc.log("Saving window state")
  let state = Object.assign({}, getState())
  // remove state pieces which we are not interested in persisting
  delete state.errors
  delete state.notice
  delete state.handlers

  return ipcRenderer
    .invoke("windows:saveState", global.windowId, getState())
    .then(() => rpc.log("Window state saved"))
}
