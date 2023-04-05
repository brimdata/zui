import ZuiApi from "../api/zui-api"
import initDebugGlobals from "./initDebugGlobals"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initPlugins from "./initPlugins"
import initStore from "./initStore"
import initLakeParams from "./initLakeParams"
import {initAutosave} from "./initAutosave"
import {commands} from "src/app/commands/command"
import {menus} from "src/core/menu"

export default async function initialize() {
  const api = new ZuiApi()
  const store = await initStore(api)
  api.init(store.dispatch, store.getState)

  const pluginManager = await initPlugins(api)
  global.featureFlags = globalThis.zui.featureFlags

  initDOM()
  await initGlobals(store)
  initIpcListeners(store)
  initLakeParams(store)
  initDebugGlobals(store, api)
  initAutosave(store)
  commands.setContext(store, api)
  menus.setContext({api})
  global.zui.invoke("windowInitialized", global.windowId)

  return {store, api, pluginManager}
}
