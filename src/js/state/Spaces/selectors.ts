import {keys} from "lodash"

import {Space} from "./types"
import {State} from "../types"

export default {
  ids: (workspaceId: string) => (state: State) => {
    return keys(getWorkspace(state, workspaceId))
  },
  get: (workspaceId: string, spaceId: string) => (state: State) => {
    return getWorkspace(state, workspaceId)[spaceId]
  },
  getName: (workspaceId: string, spaceId: string) => (state: State) => {
    const space = getWorkspace(state, workspaceId)[spaceId]
    return space ? space.name : ""
  },
  raw: (state: State) => state.spaces,
  getSpaces: (workspaceId: string | null) => (state: State): Space[] => {
    const ws = getWorkspace(state, workspaceId)
    return Object.keys(ws).map((key) => {
      return {...ws[key]}
    })
  },
  getSpaceNames: (workspaceId: string) => (state: State): string[] => {
    const ws = getWorkspace(state, workspaceId)
    return Object.keys(ws).map((key) => ws[key].name)
  },
  getIngestProgress: (workspaceId: string, spaceId: string) => (
    state: State
  ) => {
    const ws = getWorkspace(state, workspaceId)
    const space = ws[spaceId]
    if (space) return space.ingest.progress
    else return null
  },
  getIngestWarnings: (workspaceId: string, spaceId: string) => (
    state: State
  ) => {
    const ws = getWorkspace(state, workspaceId)
    const space = ws[spaceId]
    if (space) return space.ingest.warnings
    else return []
  },
  getIngestSnapshot: (workspaceId: string, spaceId: string) => (
    state: State
  ) => {
    const ws = getWorkspace(state, workspaceId)
    const space = ws[spaceId]
    if (space) return space.ingest.snapshot
  }
}

function getWorkspace(
  state,
  id
): {
  [key: string]: Space
} {
  if (!id) return {}
  return state.spaces[id] || {}
}
