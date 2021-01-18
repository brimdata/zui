import {createSelector} from "reselect"

import {WorkspacesState} from "../Workspaces/types"
import {SpacesState} from "../Spaces/types"
import {State} from "../types"
import Workspaces from "../Workspaces"
import Spaces from "../Spaces"
import activeTabSelect from "../Tab/activeTabSelect"
import brim, {BrimWorkspace, BrimSpace} from "../../brim"

type Id = string | null

export const getSpaceId = activeTabSelect((state) => state.current.spaceId)

export const getWorkspaceId = activeTabSelect(
  (state) => state.current.workspaceId
)

export const mustGetWorkspace = createSelector<
  State,
  WorkspacesState,
  Id,
  BrimWorkspace
>(Workspaces.raw, getWorkspaceId, (workspaces, id) => {
  if (!id) throw new Error("Current workspace id is unset")
  if (!workspaces[id]) throw new Error(`Missing workspace id: ${id}`)

  return brim.workspace(workspaces[id])
})

export const mustGetSpace = createSelector<
  State,
  SpacesState,
  Id,
  Id,
  BrimSpace
>(Spaces.raw, getWorkspaceId, getSpaceId, (spaces, workspaceId, spaceId) => {
  if (!workspaceId) throw new Error("Current workspace id is unset")
  if (!spaceId) throw new Error("Current space id is unset")
  if (!spaces[workspaceId])
    throw new Error(`No spaces in workspace id: ${workspaceId}`)
  if (!spaces[workspaceId][spaceId])
    throw new Error(`Missing space id: ${spaceId}`)

  return brim.space(spaces[workspaceId][spaceId])
})

export const getSpace = (state: State) => {
  try {
    return mustGetSpace(state)
  } catch {
    return null
  }
}

export const getWorkspace = (state: State) => {
  try {
    return mustGetWorkspace(state)
  } catch {
    return null
  }
}
