import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initMenuActionListeners from "./initMenuActionListeners"
import initStore from "./initStore"
import initWorkspaceParams from "./initWorkspaceParams"

export default async function initialize() {
  const store = await initStore()
  initDOM()
  initGlobals(store)
  initIpcListeners(store)
  initMenuActionListeners(store)
  initWorkspaceParams(store)
  return store
}
