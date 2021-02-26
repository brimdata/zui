import Histories from "app/core/models/histories"
import path from "path"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import Feature from "../state/Feature"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"

  global.feature = (name, status) => store.dispatch(Feature.set(name, status))
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
}
