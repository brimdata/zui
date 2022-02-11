import {matchPath} from "react-router"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <lake> <pool>
 * and <query> replaced with the actual values.
 */

export const root = {
  path: "/",
  title: "Brim"
}
export const lakeList = {
  path: "/lakes",
  title: "Choose a Lake"
}
export const lakeShow = {
  title: "<lake>",
  path: `${lakeList.path}/:lakeId`
}
export const lakeImport = {
  title: "Import Files",
  path: `${lakeShow.path}/import`
}

export const poolShow = {
  title: "<pool>",
  path: `${lakeShow.path}/pools/:poolId`
}

// TODO: deprecate this when we remove 'query-flow' feature-flag
export const lakePoolSearch = {
  title: "<lake>: <program>",
  path: `${poolShow.path}/search`
}

export const query = {
  title: "<query>",
  path: `${lakeShow.path}/queries/:queryId`
}
export const lakeReleaseNotes = {
  title: "Release Notes",
  path: `${lakeShow.path}/release-notes`
}
export const releaseNotes = {
  title: "Release Notes",
  path: "/release-notes"
}

export const allRoutes = [
  lakeReleaseNotes,
  lakePoolSearch,
  lakeImport,
  lakeShow,
  lakeList,
  poolShow,
  query,
  releaseNotes,
  root
]

export function whichRoute(pathname: string) {
  for (const route of allRoutes) {
    const match = matchPath(pathname, {path: route.path, exact: true})
    if (match) return {...route, match}
  }
  return null
}
