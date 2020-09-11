import {Store} from "../state/types"
import getUrlSearchParams from "../lib/getUrlSearchParams"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
}
