import {Store} from "../state/types"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import path from "path"
import Feature from "../state/Feature"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"

  global.feature = (name, status) => store.dispatch(Feature.set(name, status))
}
