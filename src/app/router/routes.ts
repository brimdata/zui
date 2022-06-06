import {matchPath} from "react-router"

/**
 * A single place to store all app route information. The title field is
 * used in the tab title and will have keywords like <lake> <pool>
 * and <query> replaced with the actual values.
 */

export const root = {
  path: "/",
  title: "Brim",
}
export const lakeList = {
  path: "/lakes",
  title: "Choose a Lake",
}
export const lakeShow = {
  title: "Lake: <lake>",
  path: `${lakeList.path}/:lakeId`,
}
export const lakeImport = {
  title: "New Pool",
  path: `${lakeShow.path}/import`,
}

export const poolShow = {
  title: "Pool: <pool>",
  path: `${lakeShow.path}/pools/:poolId`,
}

export const query = {
  title: "Query: <query>",
  path: `${lakeShow.path}/queries/:queryId`,
}
export const queryVersion = {
  title: "Query: <query>",
  path: `${lakeShow.path}/queries/:queryId/versions/:version`,
}
export const lakeReleaseNotes = {
  title: "Release Notes",
  path: `${lakeShow.path}/release-notes`,
}
export const releaseNotes = {
  title: "Release Notes",
  path: "/release-notes",
}

export const allRoutes = [
  lakeReleaseNotes,
  lakeImport,
  lakeShow,
  lakeList,
  poolShow,
  query,
  queryVersion,
  releaseNotes,
  root,
]

export function whichRoute(pathname: string) {
  for (const route of allRoutes) {
    const match = matchPath(pathname, {path: route.path, exact: true})
    if (match) return {...route, match}
  }
  return null
}
