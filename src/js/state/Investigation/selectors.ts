import {createSelector} from "@reduxjs/toolkit"
import {last} from "../../lib/Array"
import Current from "../Current"
import {State} from "../types"

type Id = string | null

export const raw = (state: State) => state.investigation

export const getCurrentHistory = createSelector(
  raw,
  Current.getLakeId,
  Current.getPoolId,
  (history, wsId, poolId) => {
    return (history[wsId] || {})[poolId] || []
  }
)

export const getCurrentFinding = (lakeId: Id, poolId: Id) => (state: State) => {
  if (!lakeId || !poolId) return null
  return last(state.investigation[lakeId][poolId])
}
