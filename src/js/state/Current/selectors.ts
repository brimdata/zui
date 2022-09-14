import {matchPath} from "react-router"
import brim, {BrimLake} from "../../brim"
import * as Pools from "../Pools/selectors"
import {PoolsState} from "../Pools/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Lakes from "../Lakes"
import {LakesState} from "../Lakes/types"
import {MemoryHistory} from "history"
import {Pool} from "src/app/core/pools/pool"
import Queries from "../Queries"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import QueryVersions from "../QueryVersions"
import {query, queryVersion} from "src/app/router/routes"
import SessionHistories from "../SessionHistories"
import {createSelector} from "@reduxjs/toolkit"
import {
  SessionHistoriesState,
  SessionHistoryEntry,
} from "../SessionHistories/types"
import {QueryVersion} from "../QueryVersions/types"
import {ActiveQuery} from "src/app/core/models/active-query"
import SessionQueries from "../SessionQueries"

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

const getQueryUrlParams = createSelector(getLocation, (location) => {
  const path = location.pathname
  const routes = [queryVersion.path, query.path]
  const match = matchPath<{queryId: string; version: string}>(path, routes)
  return match?.params ?? {queryId: "", version: ""}
})

export const getVersion = (state: State): QueryVersion => {
  const {queryId, version} = getQueryUrlParams(state)
  const tabId = getTabId(state)
  return (
    QueryVersions.at(queryId).find(state, version) ||
    QueryVersions.at(tabId).find(state, version)
  )
}

const getRawSession = (state: State) => {
  const id = getSessionId(state)
  return SessionQueries.find(state, id)
}

const getSessionVersions = (state: State) => {
  const id = getSessionId(state)
  return QueryVersions.at(id).all(state)
}

export const getNamedQuery = (state: State) => {
  const {queryId} = getQueryUrlParams(state)
  return Queries.build(state, queryId)
}

export const getSession = createSelector(
  getRawSession,
  getSessionVersions,
  (query, versions) => {
    if (!query) return null
    return new BrimQuery(query, versions)
  }
)

export const getActiveQuery = createSelector(
  getSession,
  getNamedQuery,
  getVersion,
  (session, query, version) => {
    return new ActiveQuery(session, query, version || QueryVersions.initial())
  }
)

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

export const getSessionId = getTabId
