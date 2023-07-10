import ZuiApi from "../api/zui-api"
import initDebugGlobals from "./initDebugGlobals"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initStore from "./initStore"
import {initAutosave} from "./initAutosave"
import {commands} from "src/app/commands/command"
import {menus} from "src/core/menu"
import {initHandlers} from "./init-handlers"
import {invoke} from "src/core/invoke"
import {WindowName} from "src/electron/windows/types"

const getWindowId = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("id")
}

const getWindowName = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("name") as WindowName
}

export default async function initialize(
  windowId: string = getWindowId(),
  windowName: WindowName = getWindowName()
) {
  global.featureFlags = globalThis.zui.featureFlags
  global.windowId = windowId
  global.windowName = windowName

  const api = new ZuiApi()
  const store = await initStore(api)

  api.init(store.dispatch, store.getState)
  initDOM()
  await initGlobals(store)
  initIpcListeners(store)
  initHandlers({dispatch: store.dispatch, select: (fn) => fn(store.getState())})
  initDebugGlobals(store, api)
  initAutosave(store)
  commands.setContext(store, api)
  menus.setContext({api})
  invoke("windowInitialized", global.windowId)

  return {store, api}
}
