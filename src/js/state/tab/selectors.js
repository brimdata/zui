/* @flow */

import {createSelector} from "reselect"

import type {Cluster, ClustersState} from "../clusters/types"
import type {State} from "../types"
import Clusters from "../clusters"
import select from "./select"

const clusterId = select((tab) => tab.search.clusterId)

const cluster = createSelector<State, void, ?Cluster, string, ClustersState>(
  clusterId,
  Clusters.raw,
  (id, obj) => obj[id]
)

export default {
  clusterId,
  cluster
}
