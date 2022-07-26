import {matchPath} from "react-router"
import brim, {BrimLake} from "../../brim"
import Pools from "../Pools"
import {PoolsState} from "../Pools/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Lakes from "../Lakes"
import {LakesState} from "../Lakes/types"
import {MemoryHistory} from "history"
import {Pool} from "src/app/core/pools/pool"
import RemoteQueries from "../RemoteQueries"
import Queries from "../Queries"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import QueryVersions from "../QueryVersions"
import {query, queryVersion} from "src/app/router/routes"
import SessionQueries from "../SessionQueries"
import SessionHistories from "../SessionHistories"
import {createSelector} from "@reduxjs/toolkit"
import {
  SessionHistoriesState,
  SessionHistoryEntry,
} from "../SessionHistories/types"
import {QueryVersion} from "../QueryVersions/types"

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
  return getHistory(state)?.location
}

export const getQueryLocationData = (
  state: State
): {queryId: string | null; version: string | null} => {
  type Params = {queryId?: string; version?: string}
  const match = matchPath<Params>(getLocation(state).pathname, [
    queryVersion.path,
    query.path,
  ])
  const version = match?.params?.version

  let queryId = match?.params?.queryId
  return {queryId, version}
}

export const getQueryById =
  (id: string, version?: string) =>
  (state: State): BrimQuery | null => {
    const query =
      SessionQueries.getById(id)(state) ||
      Queries.getQueryById(id)(state) ||
      RemoteQueries.getQueryById(id)(state)
    if (!query) return null
    const versions = QueryVersions.getByQueryId(id)(state) || []

    return new BrimQuery(query, versions, version)
  }

export const getQuery = (state: State): BrimQuery | null => {
  const {queryId, version} = getQueryLocationData(state)
  if (!queryId) return null
  return getQueryById(queryId, version)(state)
}

export const getVersion = (state: State): QueryVersion => {
  const {queryId, version} = getQueryLocationData(state)
  const tabId = getTabId(state)
  if (queryId === "session")
    return (
      QueryVersions.getByVersion(queryId, version)(state) ||
      QueryVersions.getByVersion(tabId, version)(state)
    )
}

export const getPoolId = (state) => {
  type Params = {poolId?: string}
  const match = matchPath<Params>(getLocation(state).pathname, [
    "/lakes/:lakeId/pools/:poolId",
  ])
  return match?.params?.poolId || null
}

// This is weird, we need to get this from the state and not the url.
export const getLakeId = (state: State = undefined) => {
  type Params = {lakeId?: string}
  const match = matchPath<Params>(getLocation(state).pathname, "/lakes/:lakeId")
  return match?.params?.lakeId || null
}

export const mustGetLake = createSelector<State, LakesState, Id, BrimLake>(
  Lakes.raw,
  getLakeId,
  (lakes, id) => {
    if (!id) throw new Error("Current lake id is unset")
    if (!lakes[id]) throw new Error(`Missing lake id: ${id}`)

    return brim.lake(lakes[id])
  }
)

export const getQueryPool = createSelector<
  State,
  PoolsState,
  Id,
  BrimQuery,
  Pool
>(Pools.raw, getLakeId, getQuery, (pools, lakeId, query) => {
  if (!lakeId || !query) return null
  const name = query.getPoolName()
  if (!name) return null
  if (!pools[lakeId]) return null

  const pool = Object.values(pools[lakeId]).find((p) => p.data.name === name)

  if (!pool) {
    console.error(`Missing pool: ${name}`)
    return null
  }

  return new Pool(pool.data, pool.stats)
})

export const mustGetPool = createSelector<State, PoolsState, Id, Id, Pool>(
  Pools.raw,
  getLakeId,
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

export const getLake = (state: State) => {
  try {
    return mustGetLake(state)
  } catch {
    return null
  }
}

export const getPools = createSelector(getLake, Pools.raw, (l, pools) => {
  const lakePools = pools[l.id] || {}
  return Object.keys(lakePools)
    .map((id) => lakePools[id])
    .map(({data, stats}) => new Pool(data, stats))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
})

export const getTabId = (s: State) => {
  return s.tabs.active
}

export const getSessionHistory = createSelector<
  State,
  string,
  SessionHistoriesState,
  SessionHistoryEntry[]
>([getTabId, SessionHistories.raw], (tabId, histories) => histories[tabId])
