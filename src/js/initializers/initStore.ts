import {enableMapSet} from "immer"
import ZuiApi from "../api/zui-api"
import {createWindowStore} from "../state/stores/create-window-store"

enableMapSet()

// Turn this into a single op to call from the exported function
function getInitialState(windowId) {
  return Promise.all([
    global.zui.invoke("getWindowState", windowId),
    global.zui.invoke("getGlobalState"),
  ]).then(([winState, globalState]) => {
    return {...winState, ...globalState}
  })
}

export default async (api: ZuiApi) => {
  const windowId = global.zui.windowId
  const initialState = await getInitialState(windowId)
  const extraArgument = {api}
  return createWindowStore(initialState, extraArgument)
}
