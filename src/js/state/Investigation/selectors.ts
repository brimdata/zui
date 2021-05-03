import {State} from "../types"
import {Finding} from "./types"
import {last} from "../../lib/Array"

type Id = string | null

export const getInvestigation = (workspaceId: Id, poolId: Id) => (
  state: State
): Finding[] => {
  {
    if (
      !state.investigation[workspaceId] ||
      !state.investigation[workspaceId][poolId]
    )
      return []

    return state.investigation[workspaceId][poolId]
  }
}

export const getCurrentFinding = (workspaceId: Id, poolId: Id) => (
  state: State
) => {
  if (!workspaceId || !poolId) return null
  return last(state.investigation[workspaceId][poolId])
}
