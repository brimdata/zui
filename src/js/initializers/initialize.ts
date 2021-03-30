import BrimApi from "./brimApi"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initMenuActionListeners from "./initMenuActionListeners"
import initPlugins from "./initPlugins"
import initStore from "./initStore"
import initWorkspaceParams from "./initWorkspaceParams"

export default async function initialize() {
  const store = await initStore()

  const api = new BrimApi(store)
  const pluginManager = await initPlugins(api)

  initDOM()
  initGlobals(store, api)
  initIpcListeners(store, pluginManager)
  initMenuActionListeners(store)
  initWorkspaceParams(store)
  return store
}
