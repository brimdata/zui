import {matchPath} from "react-router"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <workspace> <lake>
 * and <program> replaced with the actual values.
 */

export const root = {
  path: "/",
  title: "Brim"
}
export const workspacesList = {
  path: "/workspaces",
  title: "Choose a Lake"
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
export const lakeSearch = {
  title: "<lake>: <program>",
  path: `${lakeShow.path}/search`
}
export const workspaceReleaseNotes = {
  title: "Release Notes",
  path: `${workspaceShow.path}/release-notes`
}
export const releaseNotes = {
  title: "Release Notes",
  path: "/release-notes"
}

export const allRoutes = [
  workspaceReleaseNotes,
  lakeSearch,
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
