import initCleanup from "./initCleanup"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initMenuActionListeners from "./initMenuActionListeners"
import initStore from "./initStore"
import initConnectionParams from "./initConnectionParams"
import {initConnectionStatuses} from "./initConnectionStatuses"

export default async function initialize() {
  const store = await initStore()
  initConnectionStatuses(store)
  initDOM()
  initGlobals(store)
  initCleanup(store)
  initIpcListeners(store)
  initMenuActionListeners(store)
  initConnectionParams(store)
  return store
}
