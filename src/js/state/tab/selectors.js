/* @flow */

import {createSelector} from "reselect"

import type {Cluster, ClustersState} from "../clusters/types"
import type {Space, SpacesState} from "../spaces/types"
import type {State} from "../types"
import type {TabState} from "./types"
import Clusters from "../clusters"
import Spaces from "../spaces"
import Tabs from "../tabs"
import select from "./select"

const clusterId = select((tab) => tab.search.clusterId)

const cluster = createSelector<State, void, ?Cluster, string, ClustersState>(
  clusterId,
  Clusters.raw,
  (id, obj) => obj[id]
)

const spaceName = select((tab) => tab.search.space)

const space = createSelector<State, void, Space, TabState, SpacesState>(
  Tabs.getActiveTab,
  Spaces.raw,
  (tab, spaces) => {
    return spaces[tab.search.clusterId][tab.search.space]
  }
)

export default {
  clusterId,
  cluster,
  spaceName,
  space
}
