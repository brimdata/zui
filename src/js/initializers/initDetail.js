/* @flow */

import {ipcRenderer} from "electron"

import {viewLogDetail} from "../flows/viewLogDetail"
import LogDetails from "../state/LogDetails"
import Search from "../state/Search/actions"
import Tab from "../state/Tab"
import brim from "../brim"
import closeWindow from "../flows/closeWindow"
import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initMenuActionListeners from "./initMenuActionListeners"
import initQueryParams, {getQueryParams} from "./initQueryParams"
import initStore from "./initStore"
import initUserInputClasses from "./initUserInputClasses"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import refreshWindow from "../flows/refreshWindow"

let {id} = getQueryParams()

export default () => {
  return invoke(ipc.windows.initialState(id)).then((initialState) => {
    delete initialState.handlers

    let boom = initBoom(undefined)
    let store = initStore(initialState, boom)
    global.getState = store.getState

    let dispatch = store.dispatch

    initDOM("detail-root")
    initUserInputClasses()
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
