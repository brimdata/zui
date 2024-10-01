import {welcomePath} from "src/app/router/utils/paths"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import {BrowserTab} from "src/models/browser-tab"
import {Snapshot} from "src/models/snapshot"
import Pools from "../state/Pools"
import {getLakeId} from "../state/Current/selectors"

export function initializeTabs(store: Store) {
  if (Tabs.none(store.getState())) {
    store.dispatch(Tabs.activateUrl(welcomePath()))
  }
  const lakeId = getLakeId(store.getState())

  for (const tab of BrowserTab.all) {
    switch (tab.route.name) {
      case "snapshot":
        var id = tab.params.id
        var snapshot = Snapshot.find(id)
        if (snapshot) {
          tab.setTitle(snapshot.isEmpty ? "Query Session" : snapshot.queryText)
        } else {
          tab.setTitle("Query Session")
        }
        break
      case "poolShow":
        var id = tab.params.poolId
        var pool = Pools.get(lakeId, id)(store.getState())
        if (pool) {
          tab.setTitle(pool.name)
        } else {
          tab.setTitle("Pool")
        }
        break
      case "welcome":
        tab.setTitle("Welcome")
        break
      case "releaseNotes":
        tab.setTitle("Release Notes")
        break
    }
  }
}
