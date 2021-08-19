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
  const store = await initStore(api)
  api.init(store.dispatch, store.getState)

  const pluginManager = await initPlugins(api)

  initDOM()
  initGlobals(store)
  initIpcListeners(store, pluginManager)
  initMenuActionListeners(store)
  initWorkspaceParams(store)
  initDebugGlobals(store)
  return {store, pluginManager}
}
