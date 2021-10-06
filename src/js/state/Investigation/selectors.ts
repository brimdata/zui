import {createSelector} from "@reduxjs/toolkit"
import {last} from "../../lib/Array"
import Current from "../Current"
import {State} from "../types"

type Id = string | null

export const raw = (state: State) => state.investigation

export const getCurrentHistory = createSelector(
  raw,
  Current.getWorkspaceId,
  Current.getPoolId,
  (history, wsId, poolId) => {
    return (history[wsId] || {})[poolId] || []
  }
)

export const getCurrentFinding = (workspaceId: Id, poolId: Id) => (
  state: State
) => {
  if (!workspaceId || !poolId) return null
  return last(state.investigation[workspaceId][poolId])
}
