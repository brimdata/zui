import {State} from "../types"
import {Finding} from "./types"
import {last} from "../../lib/Array"

type Id = string | null

export const getInvestigation = (connId: Id, spaceId: Id) => (
  state: State
): Finding[] => {
  {
    if (!state.investigation[connId] || !state.investigation[connId][spaceId])
      return []

    return state.investigation[connId][spaceId]
  }
}

export const getCurrentFinding = (connId: Id, spaceId: Id) => (
  state: State
) => {
  if (!connId || !spaceId) return null
  return last(state.investigation[connId][spaceId])
}
