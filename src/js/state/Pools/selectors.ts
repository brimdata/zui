import {Pool} from "src/app/core/pools/pool"
import {find, keys} from "lodash"
import {State} from "../types"
import {PoolsState, PoolState} from "./types"
import {createSelector} from "@reduxjs/toolkit"

export const ids = (lakeId: string) => (state: State) => {
  return keys(getLake(state, lakeId))
}
export const get =
  (lakeId: string, poolId: string) =>
  (state: State): Pool | null => {
    const poolState = getLake(state, lakeId)[poolId]
    if (!poolState) return null
    return Pool.from(poolState)
  }

export const raw = (state: State): PoolsState => state.pools

export const all = createSelector(
  (_, lakeId: string) => lakeId,
  raw,
  (lakeId, pools) => {
    return Object.keys(pools[lakeId])
      .map((key) => Pool.from(pools[lakeId][key]))
      .sort((a, b) => (a.name < b.name ? -1 : 1))
  }
)
export const getPools =
  (lakeId: string | null) =>
  (state: State): Pool[] => {
    const l = getLake(state, lakeId)
    return Object.keys(l).map((key) => Pool.from(l[key]))
  }

export const getPoolNames =
  (lakeId: string) =>
  (state: State): string[] => {
    const l = getLake(state, lakeId)
    return Object.keys(l).map((key) => l[key].data.name)
  }
export const getByName = (lakeId: string, name: string) => (state: State) => {
  const lakePools = getLake(state, lakeId)
  const pool = find(lakePools, ["data.name", name])
  if (!pool) return null
  return Pool.from(pool)
}

function getLake(
  state,
  id
): {
  [key: string]: PoolState
} {
  if (!id) return {}
  return state.pools[id] || {}
}
