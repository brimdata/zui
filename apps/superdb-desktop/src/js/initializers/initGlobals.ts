import Histories from "src/modules/histories"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "src/app/router/tab-history"
import {invoke} from "src/core/invoke"
import {previewLoadFiles} from "src/domain/loads/handlers"

export default async function initGlobals(store: Store) {
  // @ts-ignore
  global.env = await invoke("env.properties", windowId)
  global.mainArgs = await invoke("mainArgs")
  global.appMeta = await invoke("getAppMeta")
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.navTo = (path) => store.dispatch(tabHistory.push(path))

  global.dropFiles = (files: string[]) => {
    previewLoadFiles({files})
  }
}
