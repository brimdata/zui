import {createSelector} from "reselect"

import {Cluster, ClustersState} from "../Clusters/types"
import {SpacesState} from "../Spaces/types"
import {State} from "../types"
import Clusters from "../Clusters"
import Spaces from "../Spaces"
import activeTabSelect from "../Tab/activeTabSelect"
import brim, {BrimSpace} from "../../brim"

type Id = string | null

export const getSpaceId = activeTabSelect((state) => state.current.spaceId)

export const getConnectionId = activeTabSelect(
  (state) => state.current.connectionId
)

export const mustGetConnection = createSelector<
  State,
  ClustersState,
  Id,
  Cluster
>(Clusters.raw, getConnectionId, (conns, id) => {
  if (!id) throw new Error("Current connection id is unset")
  if (!conns[id]) throw new Error(`Missing connection id: ${id}`)

  return conns[id]
})

export const mustGetSpace = createSelector<
  State,
  SpacesState,
  Id,
  Id,
  BrimSpace
>(Spaces.raw, getConnectionId, getSpaceId, (spaces, connId, spaceId) => {
  if (!connId) throw new Error("Current connection id is unset")
  if (!spaceId) throw new Error("Current space id is unset")
  if (!spaces[connId]) throw new Error(`No spaces in connection id: ${connId}`)
  if (!spaces[connId][spaceId]) throw new Error(`Missing space id: ${spaceId}`)

  return brim.space(spaces[connId][spaceId])
})

export const getSpace = (state: State) => {
  try {
    return mustGetSpace(state)
  } catch {
    return null
  }
}

export const getConnection = (state: State) => {
  try {
    return mustGetConnection(state)
  } catch {
    return null
  }
}
