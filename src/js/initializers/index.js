/* @flow */

import {ipcRenderer} from "electron"

import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initGlobalStore from "./initGlobalStore"
import initMenuActionListeners from "./initMenuActionListeners"
import initQueryParams, {getQueryParams} from "./initQueryParams"
import initShortcuts from "./initShortcuts"
import initStore from "./initStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import onBeforeUnload from "../flows/onBeforeUnload"

let {id} = getQueryParams()

export default () => {
  return Promise.all([
    invoke(ipc.windows.initialState(id)),
    initGlobalStore()
  ]).then(([initialState, globalStore]) => {
    let boom = initBoom(undefined)
    let store = initStore({...initialState, ...globalStore.getState()}, boom)
    initDOM()
    initShortcuts(store)
    initMenuActionListeners(store.dispatch)
    initQueryParams(store)

    global.getState = store.getState
    global.getGlobalState = globalStore.getState

    ipcRenderer.on("globalStore:dispatch", (e, {action}) => {
      store.dispatch(action)
    })

    global.onbeforeunload = (e) => {
      setTimeout(() => store.dispatch(onBeforeUnload()))
      e.returnValue = false
    }

    return {store, globalStore}
  })
}
