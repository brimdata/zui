import tabHistory from "src/app/router/tab-history"
import ZuiApi from "../api/zui-api"
import Current from "../state/Current"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export class DevGlobal {
  constructor(readonly store: Store, readonly api: ZuiApi) {}

  get url() {
    return Current.getLocation(this.store.getState())
  }

  get state() {
    return this.store.getState()
  }

  get currentTabState() {
    return Tabs.getActiveTab(this.store.getState())
  }

  navTo(url: string) {
    this.store.dispatch(tabHistory.push(url))
  }
}

export default function (store, api) {
  global.dev = new DevGlobal(store, api)
}
