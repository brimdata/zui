import Histories from "src/app/core/models/histories"
import path from "path"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "src/app/router/tab-history"
import {mainArgsOp} from "../electron/ops/main-args-op"
import {getAppMetaOp} from "../electron/ops/get-app-meta-op"

export default async function initGlobals(store: Store) {
  const id = getUrlSearchParams().id
  if (id) {
    global.windowId = id
  }
  global.windowName = getWindowName()
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.windowHistory.replace(getUrlSearchParams().href)
  global.navTo = (path) => store.dispatch(tabHistory.push(path))
  global.mainArgs = await mainArgsOp.invoke()
  global.appMeta = await getAppMetaOp.invoke()
}

function getWindowName() {
  const name = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"
    | "hidden"
  if (["search", "about", "detail", "hidden"].includes(name)) return name
  throw new Error(`Unregistered window: ${name}`)
}
