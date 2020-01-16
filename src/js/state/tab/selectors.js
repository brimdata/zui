/* @flow */

import {createSelector} from "reselect"

import type {Cluster, ClustersState} from "../Clusters/types"
import type {Space, SpacesState} from "../spaces/types"
import type {State} from "../types"
import type {TabState} from "./types"
import Chart from "../Chart"
import Clusters from "../clusters"
import History from "../history"
import Spaces from "../spaces"
import Tabs from "../tabs"
import Viewer from "../viewer"
import activeTabSelect from "./activeTabSelect"

const clusterId = activeTabSelect((tab) => tab.search.clusterId)

const cluster = createSelector<State, void, ?Cluster, string, ClustersState>(
  clusterId,
  Clusters.raw,
  (id, obj) => obj[id]
)

const space = createSelector<State, void, ?Space, TabState, SpacesState>(
  Tabs.getActiveTab,
  Spaces.raw,
  (tab, spaces) => {
    let list = spaces[tab.search.clusterId]
    if (list) return list[tab.search.space]
    else return null
  }
)

export function tabIsFetching(tab: TabState) {
  return Viewer.isFetching(tab) || Chart.isFetching(tab)
}

export default {
  clusterId,
  cluster,
  spaceName: activeTabSelect((tab) => tab.search.space),
  space,
  currentEntry: activeTabSelect(History.current),
  canGoBack: activeTabSelect(History.canGoBack),
  canGoForward: activeTabSelect(History.canGoForward),
  isFetching: activeTabSelect<boolean>(tabIsFetching)
}
