/* @flow */
import {ipcRenderer} from "electron"

import createMainStore from "../state/createMainStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

let mainStore

export default function() {
  invoke(ipc.mainStore.init()).then(({initialState}) => {
    mainStore = createMainStore(initialState)
  })

  ipcRenderer.on("mainStore:dispatch", (e, {action}) => {
    mainStore.dispatch(action)
    console.log(mainStore.getState())
  })
}

function relay(action) {
  invoke(ipc.mainStore.dispatch(action))
}

global.relay = relay
