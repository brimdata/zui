/* @flow */

import {ipcRenderer} from "electron"

import closeWindow from "../flows/closeWindow"
import initBoom from "./initBoom"
import initQueryParams, {getQueryParams} from "./initQueryParams"
import initStore from "./initStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import refreshWindow from "../flows/refreshWindow"
import initDOM from "./initDOM"
import {viewLogDetail} from "../flows/viewLogDetail"
import LogDetails from "../state/LogDetails"
import initMenuActionListeners from "./initMenuActionListeners"
import Tab from "../state/Tab"
import brim from "../brim"
import Search from "../state/Search/actions"

let {id} = getQueryParams()

export default () => {
  return invoke(ipc.windows.initialState(id)).then((initialState) => {
    delete initialState.handlers

    let boom = initBoom(undefined)
    let store = initStore(initialState, boom)
    global.getState = store.getState

    let dispatch = store.dispatch

    initDOM("detail-root")
    initQueryParams(store)
    initMenuActionListeners(dispatch)

    const state = store.getState()

    const space = Tab.space(state)
    space && dispatch(Search.setSpan(brim.space(space).everythingSpan()))

    const log = LogDetails.build(store.getState())
    dispatch(LogDetails.clear())
    log && dispatch(viewLogDetail(log))

    ipcRenderer.on("close", () => dispatch(closeWindow()))
    global.onbeforeunload = () => dispatch(refreshWindow())

    return store
  })
}
