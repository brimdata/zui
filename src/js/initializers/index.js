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

let {id} = getQueryParams()

export default () => {
  return Promise.all([
    invoke(ipc.windows.initialState(id)),
    initGlobalStore()
  ]).then(([initialState, globalStore]) => {
    let boom = initBoom(undefined)
    let store = initStore(initialState, boom)
    initDOM()
    initShortcuts(store)
    initMenuActionListeners(store.dispatch)
    initQueryParams(store)

    global.getState = store.getState

    return {store, globalStore}
  })
}

global.onbeforeunload = () => {
  const state = global.getState()

  // remove state pieces which we are not interested in persisting
  delete state.errors
  delete state.notice
  delete state.handlers

  ipcRenderer.invoke("windows:saveState", global.windowId, global.getState())
}
