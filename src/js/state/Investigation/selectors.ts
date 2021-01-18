import {State} from "../types"
import {Finding} from "./types"
import {last} from "../../lib/Array"

type Id = string | null

export const getInvestigation = (workspaceId: Id, spaceId: Id) => (
  state: State
): Finding[] => {
  {
    if (
      !state.investigation[workspaceId] ||
      !state.investigation[workspaceId][spaceId]
    )
      return []

    return state.investigation[workspaceId][spaceId]
  }
}

export const getCurrentFinding = (workspaceId: Id, spaceId: Id) => (
  state: State
) => {
  if (!workspaceId || !spaceId) return null
  return last(state.investigation[workspaceId][spaceId])
}
