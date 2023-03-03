import {enableMapSet} from "immer"
import ZuiApi from "../api/zui-api"
import {getGlobalStateOp} from "../electron/ops/get-global-state-op"
import {getWindowStateOp} from "../electron/ops/get-window-state-op"
import {getWindowId} from "../electron/windows/zui-window"
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

export default async (api: ZuiApi) => {
  const windowId = getWindowId()
  const initialState = await getInitialState(windowId)
  const extraArgument = {api}
  return createWindowStore(initialState, extraArgument)
}
