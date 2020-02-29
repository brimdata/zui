/* @flow */

import {ipcRenderer} from "electron"

import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initGlobalStore from "./initGlobalStore"
import initMenuActionListeners from "./initMenuActionListeners"
import initQueryParams from "./initQueryParams"
import initShortcuts from "./initShortcuts"
import initStore from "./initStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export default () => {
  return Promise.all([
    invoke(ipc.windows.initialState("abc123")),
    initGlobalStore()
  ]).then(([initialState, globalStore]) => {
    console.log(initialState)

    let boom = initBoom(undefined)
    let store = initStore(undefined, boom)
    initDOM()
    initShortcuts(store)
    initMenuActionListeners(store.dispatch)
    initQueryParams(store)

    global.getState = store.getState

    return {store, globalStore}
  })
}

global.onbeforeunload = () => {
  ipcRenderer.invoke("windows:saveState", global.windowId, global.getState())
}
