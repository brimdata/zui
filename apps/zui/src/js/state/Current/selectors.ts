import {matchPath} from "react-router"
import * as Pools from "../Pools/selectors"
import {State} from "../types"
import Lakes from "../Lakes"
import {MemoryHistory} from "history"
import {Pool} from "src/models/pool"
import Queries from "../Queries"
import {QueryModel} from "src/js/models/query-model"
import QueryVersions from "../QueryVersions"
import {query, queryVersion, whichRoute} from "src/app/router/routes"
import SessionHistories from "../SessionHistories"
import {createSelector} from "@reduxjs/toolkit"
import {QueryVersion} from "../QueryVersions/types"
import {ActiveQuery} from "src/models/active-query"
import SessionQueries from "../SessionQueries"
import memoizeOne from "memoize-one"
import {entitiesToArray} from "../utils"
import lake from "src/js/models/lake"
import {defaultLake} from "src/js/initializers/initLakeParams"
import {getActive} from "../Tabs/selectors"
import QueryInfo from "../QueryInfo"

export const getHistory = (
  state,
  windowName = global.windowName
): MemoryHistory => {
  const id = getActive(state)
  if (windowName === "search") return global.tabHistories.getOrCreate(id)
  if (windowName === "detail" || windowName === "hidden")
    return global.windowHistory
  throw new Error(
    "Unknown Window Name (must be search or detail), found " + windowName
  )
}

export const getLocation = (state: State) => {
  return getHistory(state)?.location
}

export const getQueryUrlParams = createSelector(getLocation, (location) => {
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

export const getQueryText = createSelector(getVersion, (version) => {
  return QueryModel.versionToZed(version)
})

const getRawSession = (state: State) => {
  const id = getSessionId(state)
  return SessionQueries.find(state, id)
}

const memoGetVersions = memoizeOne(entitiesToArray)

const getSessionVersions = (state: State) => {
  const id = getSessionId(state)
  const entities = QueryVersions.at(id).entities(state)
  const ids = QueryVersions.at(id).ids(state)
  return memoGetVersions(ids, entities)
}

export const getNamedQuery = (state: State) => {
  const queryId = getSessionRouteParentId(state)
  return Queries.build(state, queryId)
}

export const getSessionRouteParentId = (state: State) => {
  const {queryId} = getQueryUrlParams(state)
  return queryId
}

export const getSession = createSelector(
  getRawSession,
  getSessionVersions,
  (query, versions) => {
    if (!query) return null
    return new QueryModel(query, versions, "session")
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
    "/pools/:poolId",
  ])
  return match?.params?.poolId || null
}

export const getLakeId = (state: State) => {
  return state.window.lakeId ?? defaultLake().id
}

export const mustGetLake = createSelector(Lakes.raw, getLakeId, (lakes, id) => {
  if (!id) throw new Error("Current lake id is unset")
  if (!lakes[id]) throw new Error(`Missing lake id: ${id}`)

  return lake(lakes[id])
})

export const mustGetPool = createSelector(
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

export const getTabId = getActive

export const getSessionHistory = createSelector(
  [getTabId, SessionHistories.raw],
  (tabId, histories) => histories[tabId]
)

export const getSessionId = getTabId

export function getOpEventContext(state: State) {
  return {
    lakeId: getLakeId(state),
    poolName: QueryInfo.get(state).poolName,
  }
}

export type OpEventContext = ReturnType<typeof getOpEventContext>

export const getPoolFromQuery = createSelector(
  QueryInfo.get,
  getPools,
  (info, pools) => {
    return pools.find((p) => p.data.name === info.poolName) ?? null
  }
)

export const getRouteName = createSelector(getLocation, (location) => {
  const route = whichRoute(location.pathname)
  if (route) return route.name
  else return null
})
