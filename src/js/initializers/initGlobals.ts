import Histories from "app/core/models/histories"
import {workspacePath} from "app/router/utils/paths"
import path from "path"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import Feature from "../state/Feature"
import TabHistories from "../state/TabHistories"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"

  global.feature = (name, status) => store.dispatch(Feature.set(name, status))

  const tabId = Tabs.getActive(store.getState())
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.tabHistory = global.tabHistories.getOrCreate(tabId)
  if (
    global.tabHistory.length === 1 &&
    global.tabHistory.location.pathname === "/"
  ) {
    global.tabHistory.replace(workspacePath("localhost:9867"))
  }
}
