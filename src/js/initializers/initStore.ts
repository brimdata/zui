import {enableMapSet} from "immer"
import BrimApi from "../api"
import {getGlobalStateOp} from "../electron/ops/get-global-state-op"
import {getWindowStateOp} from "../electron/ops/get-window-state-op"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {createWindowStore} from "../state/stores/create-window-store"

enableMapSet()

// Turn this into a single op to call from the exported function
function getInitialState(windowId) {
  return Promise.all([
    getWindowStateOp.invoke(windowId),
    getGlobalStateOp.invoke(),
  ]).then(([winState, globalState]) => {
    return {...winState, ...globalState}
  })
}

export default async (api: BrimApi) => {
  const windowId = getUrlSearchParams().id
  const initialState = await getInitialState(windowId)
  const extraArgument = {api}
  return createWindowStore(initialState, extraArgument)
}
