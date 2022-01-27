import {matchPath} from "react-router"
import {createSelector} from "reselect"
import brim, {BrimWorkspace} from "../../brim"
import Pools from "../Pools"
import {PoolsState} from "../Pools/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Lakes from "../Lakes"
import {LakesState} from "../Lakes/types"
import {MemoryHistory} from "history"
import {Pool} from "app/core/pools/pool"

type Id = string | null

export const getHistory = (
  state,
  windowName = global.windowName
): MemoryHistory => {
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
  const match = matchPath<Params>(getLocation(state).pathname, [
    "/workspaces/:workspaceId/lakes/import",
    "/workspaces/:workspaceId/lakes/:lakeId"
  ])
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
  LakesState,
  Id,
  BrimWorkspace
>(Lakes.raw, getWorkspaceId, (workspaces, id) => {
  if (!id) throw new Error("Current lake id is unset")
  if (!workspaces[id]) throw new Error(`Missing lake id: ${id}`)

  return brim.workspace(workspaces[id])
})

export const mustGetPool = createSelector<State, PoolsState, Id, Id, Pool>(
  Pools.raw,
  getWorkspaceId,
  getPoolId,
  (pools, lakeId, poolId) => {
    if (!lakeId) throw new Error("Current lake id is unset")
    if (!poolId) throw new Error("Current pool id is unset")
    if (!pools[lakeId]) {
      throw new Error(`No pools in lake id: ${lakeId}`)
    }
    if (!pools[lakeId][poolId]) throw new Error(`Missing pool id: ${poolId}`)

    const {data, stats} = pools[lakeId][poolId]
    return new Pool(data, stats)
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

export const getPools = createSelector(getWorkspace, Pools.raw, (ws, pools) => {
  const lakePools = pools[ws.id] || {}
  return Object.keys(lakePools)
    .map((id) => lakePools[id])
    .map(({data, stats}) => new Pool(data, stats))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
})
