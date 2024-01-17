import ZuiApi from "../api/zui-api"
import initDebugGlobals from "./initDebugGlobals"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initStore from "./initStore"
import {initAutosave} from "./initAutosave"
import {commands} from "src/app/commands/command"
import {initHandlers} from "./init-handlers"
import {invoke} from "src/core/invoke"
import {WindowName} from "src/electron/windows/types"
import {initLake} from "./init-lake"
import {initializeTabs} from "./init-tabs"
import {initializeMonaco} from "./init-monaco"
import {initializePluginContextSync} from "./init-plugin-context-sync"
import {initializeZedWasm} from "./init-zed-wasm"
import toast from "react-hot-toast"
import {startTransition} from "react"
import {initResizeListener} from "./init-resize-listener"
import {setMenuContext} from "src/core/menu"

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
  await initGlobals(store)
  await initLake(store)
  api.init(store.dispatch, store.getState)
  initDOM()
  initIpcListeners(store)
  initHandlers({
    transition: startTransition,
    oldApi: api,
    dispatch: store.dispatch,
    select: (fn) => fn(store.getState()),
    invoke: invoke,
    toast: toast,
  })
  setMenuContext({select: (fn) => fn(store.getState()), api})
  initDebugGlobals(store, api)
  initAutosave(store)
  commands.setContext(store, api)
  invoke("windowInitialized", global.windowId)
  initializeTabs(store)
  initializeMonaco()
  initializePluginContextSync(store)
  initResizeListener()
  await initializeZedWasm()
  return {store, api}
}
