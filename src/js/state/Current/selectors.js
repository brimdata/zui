/* @flow */

import {createSelector} from "reselect"

import type {Cluster, ClustersState} from "../Clusters/types"
import type {Space, SpacesState} from "../Spaces/types"
import type {State} from "../types"
import Clusters from "../Clusters"
import Spaces from "../Spaces"
import activeTabSelect from "../Tab/activeTabSelect"

type Id = string | null

export const getSpaceId = activeTabSelect(
  (state) => state.current.spaceId || ""
)

export const getConnectionId = activeTabSelect(
  (state) => state.current.connectionId
)

export const getConnection = createSelector<
  State,
  void,
  ?Cluster,
  ClustersState,
  Id
>(Clusters.raw, getConnectionId, (conns, id) => {
  if (id) return conns[id]
})

export const getSpace = createSelector<
  State,
  void,
  ?Space,
  SpacesState,
  Id,
  Id
>(Spaces.raw, getConnectionId, getSpaceId, (spaces, connId, spaceId) => {
  if (connId && spaces[connId] && spaceId && spaces[connId][spaceId])
    return spaces[connId][spaceId]
})
