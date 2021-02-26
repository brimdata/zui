import {SearchParams} from "app/router/hooks/use-search-params"
import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import {decodeSearchParams} from "app/search/utils/search-params"
import {matchPath} from "react-router"
import {createSelector} from "reselect"
import brim, {BrimSpace, BrimWorkspace} from "../../brim"
import Spaces from "../Spaces"
import {SpacesState} from "../Spaces/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Workspaces from "../Workspaces"
import {WorkspacesState} from "../Workspaces/types"
import {LocationDescriptorObject} from "history"

type Id = string | null

export const getHistory = (state) => {
  const id = Tabs.getActive(state)
  return global.tabHistories.getOrCreate(id)
}

export const getLocation = (state: State) => {
  return getHistory(state).location
}

export const getSpaceId = (state) => {
  type Params = {lakeId?: string}
  const match = matchPath<Params>(
    getLocation(state).pathname,
    "/workspaces/:workspaceId/lakes/:lakeId"
  )
  return match?.params?.lakeId || null
}

export const getWorkspaceId = (state: State = undefined) => {
  type Params = {workspaceId?: string}
  const match = matchPath<Params>(
    getLocation(state).pathname,
    "/workspaces/:workspaceId"
  )
  return match?.params?.workspaceId || null
}

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
  if (!spaces[workspaceId]) {
    throw new Error(`No spaces in workspace id: ${workspaceId}`)
  }
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

export const getSearchParams = createSelector<
  State,
  LocationDescriptorObject,
  BrimSpace,
  SearchParams
>(getLocation, mustGetSpace, (location, space) => {
  const params = decodeSearchParams(location.search)
  const spanArgs = mergeDefaultSpanArgs(params.spanArgs, space)
  const spanArgsFocus =
    params.spanArgsFocus[0] && params.spanArgsFocus[1]
      ? params.spanArgsFocus
      : null
  return {...params, spanArgs, spanArgsFocus} as SearchParams
})
