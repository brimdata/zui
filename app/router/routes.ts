import {matchPath} from "react-router"

export const root = {
  path: "/brim"
}
export const workspacesList = {
  path: "/workspaces",
  title: "Choose a Workspace"
}
export const workspaceShow = {
  title: "<workspace>",
  path: "/workspaces/:workspaceId"
}
export const lakeImport = {
  title: "Import Files",
  path: `${workspaceShow.path}/lakes/import`
}
export const lakeShow = {
  title: "<lake>",
  path: `${workspaceShow.path}/lakes/:lakeId`
}
export const lakeSummary = {
  title: "<lake>: Security Summary",
  path: `${lakeShow.path}/summary`
}
export const lakeSearch = {
  title: "<lake>: <program>",
  path: `${lakeShow.path}/search`
}

export const allRoutes = [
  lakeSearch,
  lakeSummary,
  lakeImport,
  lakeShow,
  workspaceShow,
  workspacesList,
  root
]

export function whichRoute(pathname: string) {
  for (const route of allRoutes) {
    const match = matchPath(pathname, route.path)
    if (match) return {...route, match}
  }
  return null
}
