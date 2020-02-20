/* @flow */
import {ipcRenderer} from "electron"

import createGlobalStore from "../state/createGlobalStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export default function() {
  return invoke(ipc.globalStore.init()).then(({initialState}) => {
    let globalStore = createGlobalStore(initialState)

    ipcRenderer.on("globalStore:dispatch", (e, {action}) => {
      globalStore.dispatch(action)
    })

    return globalStore
  })
}
