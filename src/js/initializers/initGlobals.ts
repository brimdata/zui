import Histories from "src/app/core/models/histories"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "src/app/router/tab-history"
import {WindowName} from "../electron/windows/types"

export default async function initGlobals(store: Store) {
  const id = global.zui.windowId
  if (id) {
    global.windowId = id
  }
  global.windowName = global.zui.windowName as WindowName
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.navTo = (path) => store.dispatch(tabHistory.push(path))
  global.mainArgs = await global.zui.invoke("mainArgs")
  global.appMeta = await global.zui.invoke("getAppMeta")
}
