/* @flow */

import {ipcRenderer} from "electron"

import closeWindow from "../flows/closeWindow"
import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initGlobalStore from "./initGlobalStore"
import initMenuActionListeners from "./initMenuActionListeners"
import initNewSearchTab from "./initNewSearchTab"
import initQueryParams, {getQueryParams} from "./initQueryParams"
import initShortcuts from "./initShortcuts"
import initStore from "./initStore"
import initUserInputClasses from "./initUserInputClasses"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import refreshWindow from "../flows/refreshWindow"

let {id} = getQueryParams()

export default () => {
  return Promise.all([
    invoke(ipc.windows.initialState(id)),
    initGlobalStore()
  ]).then(([windowState, globalStore]) => {
    let globalState = globalStore.getState()
    let initState = {...windowState, ...globalState}

    let boom = initBoom(undefined)
    let store = initStore(initState, boom)
    let dispatch = store.dispatch

    initDOM("app-root")
    initUserInputClasses()
    initShortcuts(store)
    initMenuActionListeners(dispatch)
    initQueryParams(store)

    global.getState = store.getState
    global.getGlobalState = globalStore.getState

    ipcRenderer.on("globalStore:dispatch", (e, {action}) => dispatch(action))
    ipcRenderer.on("windows:newSearchTab", (e, {params}) => {
      initNewSearchTab(store, dispatch, params)
    })
    ipcRenderer.on("close", () => dispatch(closeWindow()))
    global.onbeforeunload = () => dispatch(refreshWindow())

    return {store, globalStore}
  })
}
