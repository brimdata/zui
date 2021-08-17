import Current from "../state/Current"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export class DevGlobal {
  constructor(readonly store: Store) {}

  get url() {
    return Current.getLocation(this.store.getState())
  }

  get state() {
    return this.store.getState()
  }

  get currentTabState() {
    return Tabs.getActiveTab(this.store.getState())
  }
}

export default function(store) {
  global.dev = new DevGlobal(store)
}
