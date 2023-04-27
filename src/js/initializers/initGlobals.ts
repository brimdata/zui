import Histories from "src/app/core/models/histories"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "src/app/router/tab-history"
import {WindowName} from "../../electron/windows/types"
import {invoke} from "src/core/invoke"

const getWindowId = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("id")
}

const getWindowName = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("name") as WindowName
}

export default async function initGlobals(store: Store) {
  global.windowId = getWindowId()
  global.windowName = getWindowName()
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.navTo = (path) => store.dispatch(tabHistory.push(path))
  global.mainArgs = await invoke("mainArgs")
  global.appMeta = await invoke("getAppMeta")
  global.env = await invoke("env.properties")
}
