import {Store} from "../state/types"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import path from "path"
import Feature from "../state/Feature"
import Histories from "app/core/models/histories"
import Tabs from "../state/Tabs"
import TabHistories from "../state/TabHistories"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"

  global.feature = (name, status) => store.dispatch(Feature.set(name, status))

  const tabId = Tabs.getActive(store.getState())
  /* TODO initialize the tab histories with entires in the state */
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.tabHistory = global.tabHistories.getOrCreate(tabId)
}
