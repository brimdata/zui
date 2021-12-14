import {ipcRenderer} from "electron"
import BrimApi from "../api"
import initDebugGlobals from "./initDebugGlobals"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initMenuActionListeners from "./initMenuActionListeners"
import initPlugins from "./initPlugins"
import initStore from "./initStore"
import initWorkspaceParams from "./initWorkspaceParams"

export default async function initialize() {
  const api = new BrimApi()
  console.log("initing store")
  const store = await initStore(api)
  console.log("initedStore")
  api.init(store.dispatch, store.getState)

  const pluginManager = await initPlugins(api)
  global.featureFlags = await ipcRenderer.invoke("get-feature-flags")

  initDOM()
  await initGlobals(store)
  initIpcListeners(store, pluginManager)
  initMenuActionListeners(store)
  initWorkspaceParams(store)
  initDebugGlobals(store)

  return {store, api, pluginManager}
}
