import {matchPath} from "react-router"
import {createSelector} from "reselect"
import brim, {BrimPool, BrimWorkspace} from "../../brim"
import Pools from "../Pools"
import {PoolsState} from "../Pools/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Workspaces from "../Workspaces"
import {WorkspacesState} from "../Workspaces/types"

type Id = string | null

export const getHistory = (state, windowName = global.windowName) => {
  const id = Tabs.getActive(state)
  if (windowName === "search") return global.tabHistories.getOrCreate(id)
  if (windowName === "detail" || windowName === "hidden")
    return global.windowHistory
  throw new Error("Unknown Window Name (must be search or detail)")
}

export const getLocation = (state: State) => {
  return getHistory(state).location
}

export const getPoolId = (state) => {
  type Params = {lakeId?: string}
  const match = matchPath<Params>(
    getLocation(state).pathname,
    "/workspaces/:workspaceId/lakes/:lakeId"
  )
  return match?.params?.lakeId || null
}

export const getWorkspaceId = (state: State = undefined) => {
  type Params = {workspaceId?: string}
  const match = matchPath<Params>(
    getLocation(state).pathname,
    "/workspaces/:workspaceId"
  )
  return match?.params?.workspaceId || null
}

export const mustGetWorkspace = createSelector<
  State,
  WorkspacesState,
  Id,
  BrimWorkspace
>(Workspaces.raw, getWorkspaceId, (workspaces, id) => {
  if (!id) throw new Error("Current workspace id is unset")
  if (!workspaces[id]) throw new Error(`Missing workspace id: ${id}`)

  return brim.workspace(workspaces[id])
})

export const mustGetPool = createSelector<State, PoolsState, Id, Id, BrimPool>(
  Pools.raw,
  getWorkspaceId,
  getPoolId,
  (pools, workspaceId, poolId) => {
    if (!workspaceId) throw new Error("Current workspace id is unset")
    if (!poolId) throw new Error("Current pool id is unset")
    if (!pools[workspaceId]) {
      throw new Error(`No pools in workspace id: ${workspaceId}`)
    }
    if (!pools[workspaceId][poolId])
      throw new Error(`Missing pool id: ${poolId}`)

    return brim.pool(pools[workspaceId][poolId])
  }
)

export const getPool = (state: State) => {
  try {
    return mustGetPool(state)
  } catch {
    return null
  }
}

export const getWorkspace = (state: State) => {
  try {
    return mustGetWorkspace(state)
  } catch {
    return null
  }
}
