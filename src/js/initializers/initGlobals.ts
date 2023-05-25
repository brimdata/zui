import Histories from "src/app/core/models/histories"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "src/app/router/tab-history"
import {invoke} from "src/core/invoke"

export default async function initGlobals(store: Store) {
  global.env = await invoke("env.properties")
  global.mainArgs = await invoke("mainArgs")
  global.appMeta = await invoke("getAppMeta")
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.navTo = (path) => store.dispatch(tabHistory.push(path))
}
