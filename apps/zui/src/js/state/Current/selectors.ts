import {matchPath} from "react-router"
import * as Pools from "../Pools/selectors"
import {State} from "../types"
import Lakes from "../Lakes"
import {MemoryHistory} from "history"
import {Pool} from "src/models/pool"
import QueryVersions from "../QueryVersions"
import {
  query,
  queryVersion,
  snapshotShow,
  whichRoute,
} from "src/app/router/routes"
import {createSelector} from "@reduxjs/toolkit"
import {QueryVersion} from "../QueryVersions/types"
import {Lake} from "src/models/lake"
import {defaultLake} from "src/js/initializers/initLakeParams"
import {getActive} from "../Tabs/selectors"
import QueryInfo from "../QueryInfo"
import {Snapshot} from "src/models/snapshot"
import Editor from "../Editor"

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

export const getSnapshotId = (state) => {
  const {pathname} = getLocation(state)
  const route = snapshotShow.path
  const match = matchPath<any>(pathname, [route])
  return match?.params?.id || null
}
export const getSnapshot = createSelector(getSnapshotId, (id) =>
  Snapshot.find(id)
)
export const getQueryText = createSelector(
  getSnapshot,
  (snapshot) => snapshot.queryText
)

export const mustGetLake = createSelector(Lakes.raw, getLakeId, (lakes, id) => {
  if (!id) throw new Error("Current lake id is unset")
  if (!lakes[id]) throw new Error(`Missing lake id: ${id}`)

  return new Lake(lakes[id])
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

export const getSessionId = getTabId

export function getOpEventContext(state: State) {
  return {
    lakeId: getLakeId(state),
    poolName: QueryInfo.getPoolName(state),
  }
}

export type OpEventContext = ReturnType<typeof getOpEventContext>

export const getPoolFromQuery = createSelector(
  QueryInfo.getPoolName,
  getPools,
  (poolName, pools) => {
    return pools.find((p) => p.data.name === poolName) ?? null
  }
)

export const getRouteName = createSelector(getLocation, (location) => {
  const route = whichRoute(location.pathname)
  if (route) return route.name
  else return null
})

export const getNextSnapshot = createSelector(
  getSnapshot,
  Editor.getSnapshot,
  (snapshot, editorState) => {
    return new Snapshot({
      ...editorState,
      sessionId: snapshot.sessionId,
      queryId: snapshot.queryId,
    })
  }
)
