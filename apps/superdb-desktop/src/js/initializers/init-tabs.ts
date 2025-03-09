import {welcomePath} from "src/app/router/utils/paths"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export function initializeTabs(store: Store) {
  if (Tabs.none(store.getState())) {
    store.dispatch(Tabs.activateUrl(welcomePath()))
  }
}
