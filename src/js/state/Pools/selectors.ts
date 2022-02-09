import {Pool} from "app/core/pools/pool"
import {find, keys} from "lodash"
import {State} from "../types"
import {PoolState} from "./types"

export const ids = (lakeId: string) => (state: State) => {
  return keys(getLake(state, lakeId))
}
export const get = (lakeId: string, poolId: string) => (state: State) => {
  const poolState = getLake(state, lakeId)[poolId]
  if (!poolState) return null
  return Pool.from(poolState)
}

export const raw = (state: State) => state.pools

export const getPools = (lakeId: string | null) => (state: State): Pool[] => {
  const ws = getLake(state, lakeId)
  return Object.keys(ws).map((key) => Pool.from(ws[key]))
}

export const getPoolNames = (lakeId: string) => (state: State): string[] => {
  const ws = getLake(state, lakeId)
  return Object.keys(ws).map((key) => ws[key].data.name)
}
export const getByName = (lakeId: string, name: string) => (state: State) => {
  const wsPools = getLake(state, lakeId)
  return Pool.from(find(wsPools, ["name", name]))
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
